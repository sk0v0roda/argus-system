import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, Typography, Drawer, Box, Avatar, Chip, List, ListItem, ListItemText, ListItemAvatar, Divider, TextField, Button} from "@mui/material";
import {getProcessById, Process} from "src/services/processService";
import {getStatusGraphById, StatusGraph} from "src/services/statusService";
import {getTickets, Ticket, postComment} from "src/services/ticketService";
import {DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided} from '@hello-pangea/dnd';
import {formPaperStyles} from "src/styles/formStyles";

const ProcessDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [process, setProcess] = useState<Process | null>(null);
    const [statusGraph, setStatusGraph] = useState<StatusGraph | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    navigate('/processes');
                    return;
                }

                const processData = await getProcessById(id);
                setProcess(processData);

                const graphData = await getStatusGraphById(processData.graphId);
                setStatusGraph(graphData);

                const ticketsData = await getTickets();
                setTickets(ticketsData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const isTransitionAllowed = (sourceId: string, destinationId: string): boolean => {
        if (!statusGraph) return false;
        
        // Проверяем, есть ли прямое ребро между статусами
        const hasDirectEdge = statusGraph.edges.some(
            edge => edge.source === sourceId && edge.target === destinationId
        );
        
        return hasDirectEdge;
    };

    const onDragStart = (result: any) => {
        setDraggedTicketId(result.draggableId);
    };

    const onDragEnd = (result: DropResult) => {
        setDraggedTicketId(null);
        
        if (!result.destination) return;

        const {source, destination} = result;
        
        // Если перетаскивание в ту же колонку
        if (source.droppableId === destination.droppableId) {
            const updatedTickets = [...tickets];
            const [movedTicket] = updatedTickets.splice(source.index, 1);
            updatedTickets.splice(destination.index, 0, movedTicket);
            setTickets(updatedTickets);
            return;
        }

        // Обновляем статус тикета
        const updatedTickets = [...tickets];
        const [movedTicket] = updatedTickets.splice(source.index, 1);
        movedTicket.status = {
            ...movedTicket.status,
            id: destination.droppableId,
            name: statusGraph?.nodes.find(node => node.id === destination.droppableId)?.data?.label as string || ''
        };
        updatedTickets.splice(destination.index, 0, movedTicket);
        setTickets(updatedTickets);
    };

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseDrawer = () => {
        setSelectedTicket(null);
    };

    const handleCommentSubmit = async () => {
        if (!selectedTicket || !newComment.trim()) return;

        try {
            const comment = await postComment(selectedTicket.id, newComment);
            const updatedTicket = {
                ...selectedTicket,
                comments: [...selectedTicket.comments, comment]
            };
            setSelectedTicket(updatedTicket);
            setNewComment('');
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <CircularProgress color="secondary" size={50} thickness={5}/>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{process?.name || 'Процесс'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                        <div style={{display: 'flex', gap: '12px', overflowX: 'auto', padding: '12px'}}>
                            {statusGraph?.nodes.map((statusNode) => {
                                const statusTickets = tickets.filter(ticket => ticket.status.id === statusNode.id);
                                
                                return (
                                    <Droppable 
                                        key={statusNode.id} 
                                        droppableId={statusNode.id}
                                        isDropDisabled={draggedTicketId ? 
                                            !isTransitionAllowed(
                                                tickets.find(t => t.id === draggedTicketId)?.status.id || '',
                                                statusNode.id
                                            ) : false
                                        }
                                    >
                                        {(provided: DroppableProvided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    minWidth: '250px',
                                                    backgroundColor: 'var(--card-background)',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    userSelect: 'none',
                                                    opacity: draggedTicketId && 
                                                        !isTransitionAllowed(
                                                            tickets.find(t => t.id === draggedTicketId)?.status.id || '',
                                                            statusNode.id
                                                        ) ? 0.5 : 1,
                                                    border: '1px solid var(--border-color)'
                                                }}
                                            >
                                                <Typography 
                                                    variant="subtitle1" 
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem',
                                                        color: 'var(--text-primary)',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    {statusNode.data?.label as string}
                                                </Typography>
                                                {statusTickets.map((ticket, index) => (
                                                    <Draggable
                                                        key={ticket.id}
                                                        draggableId={ticket.id}
                                                        index={index}
                                                    >
                                                        {(provided: DraggableProvided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => handleTicketClick(ticket)}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    backgroundColor: 'var(--card-background)',
                                                                    borderRadius: '4px',
                                                                    padding: '8px',
                                                                    marginBottom: '8px',
                                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                                                    userSelect: 'none',
                                                                    cursor: 'pointer',
                                                                    border: '1px solid var(--border-color)'
                                                                }}
                                                            >
                                                                <Typography 
                                                                    variant="subtitle2"
                                                                    sx={{
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: 'bold',
                                                                        color: 'var(--text-primary)',
                                                                        userSelect: 'none'
                                                                    }}
                                                                >
                                                                    {ticket.name}
                                                                </Typography>
                                                                <Typography 
                                                                    variant="body2" 
                                                                    sx={{
                                                                        fontSize: '0.85rem',
                                                                        color: 'var(--text-secondary)',
                                                                        userSelect: 'none'
                                                                    }}
                                                                >
                                                                    {ticket.description}
                                                                </Typography>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                );
                            })}
                        </div>
                    </DragDropContext>
                </Paper>
            </div>

            <Drawer
                anchor="bottom"
                open={!!selectedTicket}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: {
                        height: '60vh',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        padding: '24px'
                    }
                }}
            >
                {selectedTicket && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {selectedTicket.name}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary">
                            {selectedTicket.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={`Приоритет: ${selectedTicket.priority}`} 
                                color={selectedTicket.priority === 1 ? 'error' : 'default'}
                            />
                            <Chip 
                                label={`Срок: ${selectedTicket.deadline.toLocaleDateString()}`}
                            />
                        </Box>

                        <Divider />

                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={selectedTicket.author.avatar} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary="Автор" 
                                    secondary={selectedTicket.author.name}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={selectedTicket.executor.avatar} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary="Исполнитель" 
                                    secondary={selectedTicket.executor.name}
                                />
                            </ListItem>
                        </List>

                        <Divider />

                        <Typography variant="h6" gutterBottom>
                            Комментарии
                        </Typography>
                        {selectedTicket.comments.length > 0 ? (
                            <List>
                                {selectedTicket.comments.map((comment) => (
                                    <ListItem key={comment.id}>
                                        <ListItemAvatar>
                                            <Avatar src={comment.author.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={comment.author.name}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.primary">
                                                        {comment.text}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Комментариев пока нет
                            </Typography>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Напишите комментарий..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                multiline
                                rows={2}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleCommentSubmit}
                                disabled={!newComment.trim()}
                            >
                                Отправить
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </Layout>
    );
};

export default ProcessDetailsPage;
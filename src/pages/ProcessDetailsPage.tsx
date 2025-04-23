import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, Typography, Drawer, Box, Avatar, Chip, List, ListItem, ListItemText, ListItemAvatar, Divider, TextField, Button} from "@mui/material";
import {getProcessById, ProcessDetails, ProcessStatus, ProcessTicket, moveTicket, postComment, getTicketById, TicketDetails, TicketComment} from "src/services/processService";
import {DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided} from '@hello-pangea/dnd';
import {formPaperStyles} from "src/styles/formStyles";

const ProcessDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [process, setProcess] = useState<ProcessDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    navigate('/processes');
                    return;
                }

                const processData = await getProcessById(id);
                setProcess(processData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const isTransitionAllowed = (sourceStatusId: string, destinationStatusId: string): boolean => {
        if (!process) return false;
        
        const sourceStatus = process.statuses.find(s => s.id === sourceStatusId);
        const destinationStatus = process.statuses.find(s => s.id === destinationStatusId);
        
        if (!sourceStatus || !destinationStatus) return false;
        
        // Проверяем, что статусы идут по порядку
        return destinationStatus.orderNum === sourceStatus.orderNum + 1;
    };

    const onDragStart = (result: any) => {
        setDraggedTicketId(result.draggableId);
    };

    const onDragEnd = async (result: DropResult) => {
        setDraggedTicketId(null);
        
        if (!result.destination || !process) return;

        const {source, destination} = result;
        
        // Если перетаскивание в ту же колонку
        if (source.droppableId === destination.droppableId) {
            const updatedProcess = {...process};
            const status = updatedProcess.statuses.find(s => s.id === source.droppableId);
            if (status) {
                const [movedTicket] = status.tickets.splice(source.index, 1);
                status.tickets.splice(destination.index, 0, movedTicket);
                setProcess(updatedProcess);
            }
            return;
        }

        // Проверяем, разрешен ли переход
        if (!isTransitionAllowed(source.droppableId, destination.droppableId)) {
            return;
        }

        try {
            // Получаем ID тикета, который перемещается
            const sourceStatusForTicket = process.statuses.find(s => s.id === source.droppableId);
            const ticketId = sourceStatusForTicket?.tickets[source.index].id;

            if (!ticketId) {
                console.error('Не найден ID тикета для перемещения');
                return;
            }

            // Отправляем запрос на сервер
            await moveTicket(ticketId, destination.droppableId);

            // Обновляем состояние процесса
            const updatedProcess = {...process};
            const sourceStatus = updatedProcess.statuses.find(s => s.id === source.droppableId);
            const destinationStatus = updatedProcess.statuses.find(s => s.id === destination.droppableId);
            
            if (sourceStatus && destinationStatus) {
                const [movedTicket] = sourceStatus.tickets.splice(source.index, 1);
                destinationStatus.tickets.splice(destination.index, 0, movedTicket);
                setProcess(updatedProcess);
            }
        } catch (error) {
            console.error('Ошибка при перемещении тикета:', error);
            // TODO: Добавить уведомление пользователю об ошибке
        }
    };

    const handleTicketClick = async (ticket: ProcessTicket) => {
        try {
            const ticketDetails = await getTicketById(ticket.id);
            setSelectedTicket(ticketDetails);
        } catch (error) {
            console.error('Ошибка при получении деталей тикета:', error);
        }
    };

    const handleCloseDrawer = () => {
        setSelectedTicket(null);
    };

    const handleCommentSubmit = async () => {
        if (!selectedTicket || !newComment.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await postComment(selectedTicket.id, newComment.trim());
            
            // Создаем новый комментарий для отображения
            const newCommentObj: TicketComment = {
                id: Date.now().toString(), // Временный ID
                text: newComment.trim(),
                mentionedUsers: [],
                author: {
                    id: 1, // Временные данные автора
                    name: 'Текущий пользователь',
                    avatar: ''
                },
                createdAt: new Date().toISOString()
            };

            // Обновляем состояние с новым комментарием
            setSelectedTicket(prev => prev ? {
                ...prev,
                comments: [...prev.comments, newCommentObj]
            } : null);
            
            setNewComment('');
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        } finally {
            setIsSubmitting(false);
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
                            {process?.statuses.map((status) => (
                                <Droppable 
                                    key={status.id} 
                                    droppableId={status.id}
                                    isDropDisabled={draggedTicketId ? 
                                        !isTransitionAllowed(
                                            process.statuses.find(s => 
                                                s.tickets.some(t => t.id === draggedTicketId)
                                            )?.id || '',
                                            status.id
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
                                                        process.statuses.find(s => 
                                                            s.tickets.some(t => t.id === draggedTicketId)
                                                        )?.id || '',
                                                        status.id
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
                                                {status.name}
                                            </Typography>
                                            {status.tickets.map((ticket, index) => (
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
                                                                {new Date(ticket.deadline).toLocaleString()}
                                                            </Typography>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
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

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={`Приоритет: ${selectedTicket.priority}`} 
                                color={selectedTicket.priority === 1 ? 'error' : 'default'}
                            />
                            <Chip 
                                label={`Срок: ${new Date(selectedTicket.deadline).toLocaleString()}`}
                            />
                        </Box>

                        <Divider />

                        <List>
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

                        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {selectedTicket.comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={comment.author.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.author.name}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {comment.text}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', mt: 0.5 }}
                                                >
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Напишите комментарий..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                multiline
                                rows={2}
                                disabled={isSubmitting}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleCommentSubmit}
                                disabled={!newComment.trim() || isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </Layout>
    );
};

export default ProcessDetailsPage;
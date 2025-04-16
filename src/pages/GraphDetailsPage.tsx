import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions} from "@mui/material";
import {getStatusGraphById, createStatusGraph, StatusGraph, StatusGraphDTO} from "src/services/statusService";
import StatusGraphEditor from "src/components/StatusGraphEditor";
import {formPaperStyles, formButtonStyles, formTextFieldStyles} from "src/styles/formStyles";

const GraphDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState<StatusGraph | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [graphToSave, setGraphToSave] = useState<StatusGraph | null>(null);
    const [graphName, setGraphName] = useState('');
    const [graphDescription, setGraphDescription] = useState('');
    const isCreating = !id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового графа
                    setGraphData({
                        id: '',
                        name: '',
                        description: '',
                        nodes: [],
                        edges: []
                    });
                    setIsLoading(false);
                    return;
                }

                const data = await getStatusGraphById(id);
                setGraphData(data);
                setGraphName(data.name);
                setGraphDescription(data.description);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        if (!graphData) return;

        const graphDTO: StatusGraphDTO = {
            name: graphName,
            description: graphDescription,
            vertexes: graphData.nodes.map(node => node.id),
            edges: graphData.edges.map(edge => ({
                from: edge.source,
                to: edge.target
            }))
        };

        try {
            await createStatusGraph(graphDTO);
            navigate('/graphs');
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    };

    const handleGraphChange = (graph: StatusGraph) => {
        setGraphToSave(graph);
        setIsSaveDialogOpen(true);
    };

    const handleDialogSave = () => {
        if (graphToSave) {
            setGraphData(graphToSave);
            setIsSaveDialogOpen(false);
            handleSave();
        }
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание графа статусов' : 'Просмотр графа статусов'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
                    ) : graphData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <StatusGraphEditor
                                graph={graphData}
                                onSave={isCreating ? handleGraphChange : undefined}
                                isEditing={isCreating}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {isCreating ? (
                                    <>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => navigate('/graphs')}
                                            sx={formButtonStyles}
                                        >
                                            Отмена
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleSave}
                                            sx={formButtonStyles}
                                        >
                                            Создать
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => navigate('/graphs')}
                                        sx={formButtonStyles}
                                    >
                                        Назад
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    ) : !isCreating && (
                        <div>Граф не найден</div>
                    )}
                </Paper>
            </div>

            <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
                <DialogTitle>Сохранение графа</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        value={graphName}
                        onChange={(e) => setGraphName(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Описание"
                        value={graphDescription}
                        onChange={(e) => setGraphDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSaveDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleDialogSave} disabled={!graphName.trim()}>Создать</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default GraphDetailsPage;
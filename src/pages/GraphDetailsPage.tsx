import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions} from "@mui/material";
import {getStatusGraphById, updateStatusGraph, createStatusGraph, StatusGraph} from "src/services/mainService";
import StatusGraphEditor from "src/components/StatusGraphEditor";
import {formPaperStyles, formButtonStyles, formTextFieldStyles} from "src/styles/formStyles";

const GraphDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState<StatusGraph | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [graphToSave, setGraphToSave] = useState<StatusGraph | null>(null);
    const [graphName, setGraphName] = useState('');
    const isCreating = !id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового графа
                    setGraphData({
                        id: '',
                        name: '',
                        nodes: [],
                        edges: []
                    });
                    setIsEditing(true);
                    setIsLoading(false);
                    return;
                }

                const data = await getStatusGraphById(id);
                setGraphData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGraphSave = async (updatedGraph: StatusGraph) => {
        if (isCreating) {
            setGraphToSave(updatedGraph);
            setGraphName('');
            setIsSaveDialogOpen(true);
        } else {
            try {
                await updateStatusGraph(updatedGraph);
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleConfirmSave = async () => {
        if (!graphToSave || !graphName.trim()) return;

        try {
            await createStatusGraph({
                ...graphToSave,
                name: graphName
            });
            setIsSaveDialogOpen(false);
            navigate('/statusgraphs');
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание графа статусов' : graphData?.name || 'Граф статусов'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
                    ) : graphData ? (
                        <>
                            <StatusGraphEditor 
                                graph={graphData}
                                onSave={handleGraphSave}
                                isEditing={isEditing || isCreating}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {!isEditing && !isCreating && (
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setIsEditing(true)}
                                        sx={formButtonStyles}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                                <Button 
                                    variant="outlined" 
                                    onClick={() => {
                                        if (isCreating || isEditing) {
                                            navigate('/statusgraphs');
                                        } else {
                                            setIsEditing(false);
                                        }
                                    }}
                                    sx={formButtonStyles}
                                >
                                    {isCreating || isEditing ? 'Отмена' : 'Назад'}
                                </Button>
                            </Box>
                        </>
                    ) : !isCreating && (
                        <div>Граф не найден</div>
                    )}
                </Paper>
            </div>

            <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
                <DialogTitle>Сохранение графа статусов</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название графа"
                        fullWidth
                        variant="outlined"
                        value={graphName}
                        onChange={(e) => setGraphName(e.target.value)}
                        sx={formTextFieldStyles}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="outlined" 
                        onClick={() => setIsSaveDialogOpen(false)}
                        sx={formButtonStyles}
                    >
                        Отмена
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleConfirmSave}
                        disabled={!graphName.trim()}
                        sx={formButtonStyles}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default GraphDetailsPage;
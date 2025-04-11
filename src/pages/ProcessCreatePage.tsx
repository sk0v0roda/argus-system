import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Process, createProcess } from '../services/processService';
import { StatusGraph, getStatusGraphs } from '../services/statusService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const ProcessCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [processData, setProcessData] = useState<Omit<Process, 'id'>>({
        name: '',
        description: '',
        graphId: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [statusGraphs, setStatusGraphs] = useState<StatusGraph[]>([]);
    const [isGraphsLoading, setIsGraphsLoading] = useState(true);

    useEffect(() => {
        const fetchGraphs = async () => {
            try {
                const graphs = await getStatusGraphs();
                setStatusGraphs(graphs);
                if (graphs.length > 0) {
                    setProcessData(prev => ({
                        ...prev,
                        graphId: graphs[0].id
                    }));
                }
            } catch (error) {
                console.error('Ошибка загрузки графов статусов:', error);
            } finally {
                setIsGraphsLoading(false);
            }
        };

        fetchGraphs();
    }, []);

    const handleTextChange = (field: 'name' | 'description') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setProcessData(prev => ({
            ...prev,
            graphId: event.target.value
        }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            console.log('Создаваемый процесс:', processData);
            await createProcess(processData);
            navigate('/processes');
        } catch (error) {
            console.error('Ошибка при создании процесса:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Создание процесса</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Название"
                            value={processData.name}
                            onChange={handleTextChange('name')}
                            fullWidth
                            sx={formTextFieldStyles}
                        />
                        <TextField
                            label="Описание"
                            value={processData.description}
                            onChange={handleTextChange('description')}
                            fullWidth
                            multiline
                            rows={4}
                            sx={formTextFieldStyles}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Граф статусов</InputLabel>
                            <Select
                                value={processData.graphId}
                                onChange={handleSelectChange}
                                label="Граф статусов"
                                disabled={isGraphsLoading}
                                sx={formTextFieldStyles}
                            >
                                {isGraphsLoading ? (
                                    <MenuItem value="">
                                        <CircularProgress size={20} />
                                    </MenuItem>
                                ) : (
                                    statusGraphs.map(graph => (
                                        <MenuItem key={graph.id} value={graph.id}>
                                            {graph.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/processes')}
                                sx={formButtonStyles}
                            >
                                Отмена
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={handleSave}
                                disabled={isLoading || !processData.name.trim() || !processData.graphId}
                                sx={formButtonStyles}
                            >
                                {isLoading ? 'Сохранение...' : 'Создать'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </div>
        </Layout>
    );
};

export default ProcessCreatePage; 
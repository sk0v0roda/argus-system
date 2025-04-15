import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, TextField, Button, Box, Autocomplete, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent} from "@mui/material";
import {Sensor, getSensorById, updateSensor, createSensor} from "src/services/sensorService";
import {Process, getProcesses} from "src/services/processService";
import {formTextFieldStyles, formPaperStyles, formButtonStyles} from "src/styles/formStyles";

const SensorDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [sensorData, setSensorData] = useState<Sensor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [isProcessesLoading, setIsProcessesLoading] = useState(true);
    const isCreating = !id;

    const priorities = [
        { value: 'Низкий', label: 'Низкий' },
        { value: 'Средний', label: 'Средний' },
        { value: 'Высокий', label: 'Высокий' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового датчика
                    setSensorData({
                        id: undefined,
                        ticketTitle: '',
                        ticketDescription: '',
                        ticketPriority: 'Средний',
                        ticketDeadline: new Date(),
                        businessProcessId: ''
                    });
                    setIsEditing(true);
                    setIsLoading(false);
                    return;
                }

                const data = await getSensorById(id);
                setSensorData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchProcesses = async () => {
            try {
                const processesList = await getProcesses();
                setProcesses(processesList);
            } catch (error) {
                console.error('Ошибка загрузки процессов:', error);
            } finally {
                setIsProcessesLoading(false);
            }
        };

        fetchData();
        fetchProcesses();
    }, [id]);

    const handleSave = async () => {
        if (sensorData) {
            try {
                let savedSensor;
                if (isCreating) {
                    savedSensor = await createSensor(sensorData);
                    navigate('/sensors');
                } else {
                    savedSensor = await updateSensor(sensorData);
                }
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Sensor) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (sensorData) {
            setSensorData({
                ...sensorData,
                [field]: field === 'ticketDeadline' ? 
                    (event.target.value ? new Date(event.target.value) : new Date()) 
                    : event.target.value
            });
        }
    };

    const handlePriorityChange = (event: SelectChangeEvent<string>) => {
        if (sensorData) {
            setSensorData({
                ...sensorData,
                ticketPriority: event.target.value
            });
        }
    };

    const handleProcessChange = (event: React.SyntheticEvent, newValue: Process | null) => {
        if (sensorData && newValue) {
            setSensorData({
                ...sensorData,
                businessProcessId: newValue.id
            });
        }
    };

    const getSelectedProcess = () => {
        return processes.find(p => p.id === sensorData?.businessProcessId) || null;
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание датчика' : 'Детали датчика'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
                    ) : sensorData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Название"
                                value={sensorData.ticketTitle}
                                onChange={handleChange('ticketTitle')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Описание"    
                                value={sensorData.ticketDescription}
                                onChange={handleChange('ticketDescription')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={4}
                                sx={formTextFieldStyles}
                            />
                            <FormControl fullWidth disabled={!isEditing}>
                                <InputLabel>Приоритет</InputLabel>
                                <Select
                                    value={sensorData.ticketPriority}
                                    onChange={handlePriorityChange}
                                    label="Приоритет"
                                    sx={formTextFieldStyles}
                                >
                                    {priorities.map((priority) => (
                                        <MenuItem key={priority.value} value={priority.value}>
                                            {priority.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Срок"
                                type="date"
                                value={sensorData.ticketDeadline.toISOString().split('T')[0]}
                                onChange={handleChange('ticketDeadline')}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={formTextFieldStyles}
                            />
                            <Autocomplete
                                value={getSelectedProcess()}
                                onChange={handleProcessChange}
                                options={processes}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Бизнес-процесс"
                                        disabled={!isEditing || isProcessesLoading}
                                        sx={formTextFieldStyles}
                                    />
                                )}
                                loading={isProcessesLoading}
                                loadingText="Загрузка..."
                                noOptionsText="Ничего не найдено"
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {!isEditing && !isCreating ? (
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setIsEditing(true)}
                                        sx={formButtonStyles}
                                    >
                                        Редактировать
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => {
                                                if (isCreating) {
                                                    navigate('/sensors');
                                                } else {
                                                    setIsEditing(false);
                                                }
                                            }}
                                            sx={formButtonStyles}
                                        >
                                            Отмена
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleSave}
                                            sx={formButtonStyles}
                                        >
                                            {isCreating ? 'Создать' : 'Сохранить'}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ) : !isCreating && (
                        <div>Датчик не найден</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default SensorDetailsPage; 
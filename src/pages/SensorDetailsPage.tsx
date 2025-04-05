import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, TextField, Button, Box} from "@mui/material";
import {getSensorById, updateSensor, createSensor, Sensor} from "src/services/mainService";
import {formTextFieldStyles, formPaperStyles, formButtonStyles} from "src/styles/formStyles";

const SensorDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [sensorData, setSensorData] = useState<Sensor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const isCreating = !id;

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

        fetchData();
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
                            <TextField
                                label="Приоритет"
                                value={sensorData.ticketPriority}
                                onChange={handleChange('ticketPriority')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
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
                            <TextField
                                label="ID бизнес-процесса"
                                value={sensorData.businessProcessId}
                                onChange={handleChange('businessProcessId')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
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
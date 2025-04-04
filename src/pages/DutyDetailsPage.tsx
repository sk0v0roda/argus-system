import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Duty, getDutyById, updateDuty } from '../services/mainService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const DutyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dutyData, setDutyData] = useState<Duty | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    throw new Error('ID дежурства не указан');
                }

                const data = await getDutyById(parseInt(id));
                setDutyData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        if (dutyData) {
            try {
                console.log('Сохранение дежурства:', {
                    id: dutyData.id,
                    start_time: dutyData.start_time,
                    duration: dutyData.interval.seconds / 3600,
                    employeeIds: dutyData.ids
                });
                await updateDuty(dutyData);
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Duty | 'duration' | 'employeeIds') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!dutyData) return;

        const value = event.target.value;
        let updatedData: Duty = { ...dutyData };

        switch (field) {
            case 'start_time':
                updatedData.start_time = new Date(value);
                break;
            case 'duration':
                const hours = parseFloat(value);
                updatedData.interval = {
                    ...updatedData.interval,
                    seconds: hours * 3600
                };
                break;
            case 'employeeIds':
                updatedData.ids = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                break;
        }

        setDutyData(updatedData);
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Детали дежурства</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5} />
                    ) : dutyData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Время начала"
                                type="datetime-local"
                                value={new Date(dutyData.start_time).toISOString().slice(0, 16)}
                                onChange={handleChange('start_time')}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Длительность (часов)"
                                type="number"
                                value={dutyData.interval.seconds / 3600}
                                onChange={handleChange('duration')}
                                disabled={!isEditing}
                                fullWidth
                                inputProps={{
                                    min: 1,
                                    max: 24,
                                    step: 0.5
                                }}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="ID сотрудников (через запятую)"
                                value={dutyData.ids.join(', ')}
                                onChange={handleChange('employeeIds')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {!isEditing ? (
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
                                            onClick={() => setIsEditing(false)}
                                            sx={formButtonStyles}
                                        >
                                            Отмена
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleSave}
                                            sx={formButtonStyles}
                                        >
                                            Сохранить
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <div>Дежурство не найдено</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default DutyDetailsPage; 
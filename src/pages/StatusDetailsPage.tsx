import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Status, getStatusById, updateStatus } from '../services/mainService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const StatusDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [statusData, setStatusData] = useState<Status | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    throw new Error('ID статуса не указан');
                }

                const data = await getStatusById(id);
                setStatusData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        if (statusData) {
            try {
                console.log('Сохранение статуса:', {
                    id: statusData.id,
                    name: statusData.name,
                    description: statusData.description,
                    escalationSLA: statusData.escalationSLA,
                    notification: statusData.notification,
                    comment: statusData.comment,
                    dutyId: statusData.dutyId
                });
                await updateStatus(statusData);
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Status | 'deliveryType' | 'pingInterval' | 'commentText' | 'userIds') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!statusData) return;

        const value = event.target.value;
        let updatedData: Status = { ...statusData };

        switch (field) {
            case 'name':
            case 'description':
                updatedData[field] = value;
                break;
            case 'escalationSLA':
                updatedData.escalationSLA = parseInt(value);
                break;
            case 'deliveryType':
                updatedData.notification = {
                    ...updatedData.notification,
                    deliveryType: value
                };
                break;
            case 'pingInterval':
                updatedData.notification = {
                    ...updatedData.notification,
                    pingInterval: parseInt(value)
                };
                break;
            case 'commentText':
                updatedData.comment = {
                    ...updatedData.comment,
                    text: value
                };
                break;
            case 'userIds':
                updatedData.comment = {
                    ...updatedData.comment,
                    userIds: value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                };
                break;
            case 'dutyId':
                updatedData.dutyId = parseInt(value);
                break;
        }

        setStatusData(updatedData);
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Детали статуса</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5} />
                    ) : statusData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Название"
                                value={statusData.name}
                                onChange={handleChange('name')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Описание"
                                value={statusData.description}
                                onChange={handleChange('description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={4}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="SLA эскалации (минуты)"
                                type="number"
                                value={statusData.escalationSLA}
                                onChange={handleChange('escalationSLA')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Тип доставки уведомления"
                                value={statusData.notification.deliveryType}
                                onChange={handleChange('deliveryType')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Интервал уведомлений (минуты)"
                                type="number"
                                value={statusData.notification.pingInterval}
                                onChange={handleChange('pingInterval')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Комментарий"
                                value={statusData.comment.text}
                                onChange={handleChange('commentText')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={2}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="ID пользователей (через запятую)"
                                value={statusData.comment.userIds.join(', ')}
                                onChange={handleChange('userIds')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="ID дежурства"
                                type="number"
                                value={statusData.dutyId}
                                onChange={handleChange('dutyId')}
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
                        <div>Статус не найден</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default StatusDetailsPage; 
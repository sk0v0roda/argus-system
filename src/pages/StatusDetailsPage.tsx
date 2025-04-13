import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Status, getStatusById, updateStatus, createStatus } from '../services/statusService';
import { User, getUsers } from '../services/userService';
import { Duty, getDuties } from '../services/dutyService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box, Autocomplete, Chip } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const StatusDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState<Status | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [duties, setDuties] = useState<Duty[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isDutiesLoading, setIsDutiesLoading] = useState(true);
    const isCreating = !id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового статуса
                    setStatusData({
                        id: undefined,
                        name: '',
                        description: '',
                        escalationSLA: 60,
                        notification: {
                            deliveryType: 'Email',
                            pingInterval: 15
                        },
                        comment: {
                            text: '',
                            userIds: []
                        },
                        dutyId: 1
                    });
                    setIsEditing(true);
                    setIsLoading(false);
                    return;
                }

                const data = await getStatusById(id);
                setStatusData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const usersList = await getUsers();
                setUsers(usersList);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            } finally {
                setIsUsersLoading(false);
            }
        };

        const fetchDuties = async () => {
            try {
                const dutiesList = await getDuties();
                setDuties(dutiesList);
            } catch (error) {
                console.error('Ошибка загрузки дежурств:', error);
            } finally {
                setIsDutiesLoading(false);
            }
        };

        fetchData();
        fetchUsers();
        fetchDuties();
    }, [id]);

    const handleSave = async () => {
        if (statusData) {
            try {
                let savedStatus;
                if (isCreating) {
                    savedStatus = await createStatus(statusData);
                    navigate('/statuses');
                } else {
                    savedStatus = await updateStatus(statusData);
                }
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Status | 'deliveryType' | 'pingInterval' | 'commentText') => 
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
                updatedData.escalationSLA = parseInt(value) || 0;
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
                    pingInterval: parseInt(value) || 0
                };
                break;
            case 'commentText':
                updatedData.comment = {
                    ...updatedData.comment,
                    text: value
                };
                break;
        }

        setStatusData(updatedData);
    };

    const handleUserChange = (event: React.SyntheticEvent, newValue: User[]) => {
        if (!statusData) return;
        
        setStatusData({
            ...statusData,
            comment: {
                ...statusData.comment,
                userIds: newValue.map(user => user.id)
            }
        });
    };

    const handleDutyChange = (event: React.SyntheticEvent, newValue: Duty | null) => {
        if (!statusData) return;
        
        setStatusData({
            ...statusData,
            dutyId: newValue?.id || 1
        });
    };

    const getSelectedUsers = () => {
        return users.filter(user => statusData?.comment.userIds.includes(user.id));
    };

    const getSelectedDuty = () => {
        return duties.find(duty => duty.id === statusData?.dutyId) || null;
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание статуса' : 'Детали статуса'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
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
                                label="Тип уведомления"
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
                            <Autocomplete
                                multiple
                                value={getSelectedUsers()}
                                onChange={handleUserChange}
                                options={users}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Пользователи"
                                        disabled={!isEditing || isUsersLoading}
                                        sx={formTextFieldStyles}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                loading={isUsersLoading}
                                loadingText="Загрузка..."
                                noOptionsText="Ничего не найдено"
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                            <Autocomplete
                                value={getSelectedDuty()}
                                onChange={handleDutyChange}
                                options={duties}
                                getOptionLabel={(option) => `Дежурство #${option.id} (${new Date(option.start_time).toLocaleString()})`}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Дежурство"
                                        disabled={!isEditing || isDutiesLoading}
                                        sx={formTextFieldStyles}
                                    />
                                )}
                                loading={isDutiesLoading}
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
                                                    navigate('/statuses');
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
                        <div>Статус не найден</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default StatusDetailsPage; 
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Status, getStatusById, updateStatus, createStatus, NotificationType } from '../services/statusService';
import { User, getUsers } from '../services/userService';
import { Duty, getDuties } from '../services/dutyService';
import Layout from "src/components/Layout";
import { 
    CircularProgress, 
    Paper, 
    TextField, 
    Button, 
    Box, 
    Autocomplete, 
    Chip, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    SelectChangeEvent,
    FormHelperText
} from "@mui/material";
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

    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
        escalationSLA?: string;
        pingInterval?: string;
        commentText?: string;
        users?: string;
        duty?: string;
    }>({});

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
                            deliveryType: NotificationType.EMAIL,
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

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!statusData?.name?.trim()) {
            newErrors.name = 'Название обязательно';
        }

        if (!statusData?.description?.trim()) {
            newErrors.description = 'Описание обязательно';
        }

        if (!statusData?.escalationSLA || statusData.escalationSLA < 1) {
            newErrors.escalationSLA = 'SLA эскалации должен быть больше 0';
        }

        if (!statusData?.notification.pingInterval || statusData.notification.pingInterval < 1) {
            newErrors.pingInterval = 'Интервал уведомлений должен быть больше 0';
        }

        if (!statusData?.comment.userIds?.length) {
            newErrors.users = 'Выберите хотя бы одного пользователя';
        }

        if (!statusData?.dutyId) {
            newErrors.duty = 'Выберите дежурство';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (statusData && validateForm()) {
            try {
                let savedStatus;
                if (isCreating) {
                    const { id, ...statusWithoutId } = statusData;
                    savedStatus = await createStatus(statusWithoutId);
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

    const handleTextChange = (field: 'name' | 'description' | 'commentText') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!statusData) return;
        if (field === 'commentText') {
            setStatusData({
                ...statusData,
                comment: {
                    ...statusData.comment,
                    text: event.target.value
                }
            });
        } else {
            setStatusData({
                ...statusData,
                [field]: event.target.value
            });
        }
    };

    const handleNumberChange = (field: 'escalationSLA' | 'pingInterval') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!statusData) return;
        const value = parseInt(event.target.value) || 0;
        if (field === 'pingInterval') {
            setStatusData({
                ...statusData,
                notification: {
                    ...statusData.notification,
                    pingInterval: value
                }
            });
        } else {
            setStatusData({
                ...statusData,
                [field]: value
            });
        }
    };

    const handleDeliveryTypeChange = (event: SelectChangeEvent<NotificationType>) => {
        if (!statusData) return;
        setStatusData({
            ...statusData,
            notification: {
                ...statusData.notification,
                deliveryType: Number(event.target.value) as NotificationType
            }
        });
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
        if (!statusData?.comment?.userIds) {
            return [];
        }
        return users.filter(user => statusData.comment.userIds.includes(user.id));
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
                                onChange={handleTextChange('name')}
                                disabled={!isEditing}
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Описание"
                                value={statusData.description}
                                onChange={handleTextChange('description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="SLA эскалации (минуты)"
                                type="number"
                                value={statusData.escalationSLA}
                                onChange={handleNumberChange('escalationSLA')}
                                disabled={!isEditing}
                                fullWidth
                                error={!!errors.escalationSLA}
                                helperText={errors.escalationSLA}
                                inputProps={{ min: 1 }}
                                sx={formTextFieldStyles}
                            />
                            <FormControl fullWidth sx={formTextFieldStyles}>
                                <InputLabel>Тип уведомления</InputLabel>
                                <Select
                                    value={statusData.notification.deliveryType}
                                    onChange={handleDeliveryTypeChange}
                                    label="Тип уведомления"
                                    disabled={!isEditing}
                                >
                                    <MenuItem value={NotificationType.SMS}>СМС</MenuItem>
                                    <MenuItem value={NotificationType.EMAIL}>Email</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Интервал уведомлений (минуты)"
                                type="number"
                                value={statusData.notification.pingInterval}
                                onChange={handleNumberChange('pingInterval')}
                                disabled={!isEditing}
                                fullWidth
                                error={!!errors.pingInterval}
                                helperText={errors.pingInterval}
                                inputProps={{ min: 1 }}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Комментарий"
                                value={statusData.comment.text}
                                onChange={handleTextChange('commentText')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={2}
                                error={!!errors.commentText}
                                helperText={errors.commentText}
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
                                        error={!!errors.users}
                                        helperText={errors.users}
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
                                getOptionLabel={(option) => `${option.name} (${new Date(option.start_time).toLocaleString()})`}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Дежурство"
                                        disabled={!isEditing || isDutiesLoading}
                                        error={!!errors.duty}
                                        helperText={errors.duty}
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
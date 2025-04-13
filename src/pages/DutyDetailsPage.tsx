import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Duty, getDutyById, updateDuty, createDuty } from '../services/dutyService';
import { User, getUsers } from '../services/userService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box, Autocomplete, Chip } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const DutyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [dutyData, setDutyData] = useState<Duty | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const isCreating = !id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового дежурства
                    setDutyData({
                        id: undefined,
                        start_time: new Date(),
                        interval: {
                            seconds: 28800, // 8 часов по умолчанию
                            zero: false,
                            nano: 0,
                            negative: false,
                            positive: true,
                            units: [
                                {
                                    durationEstimated: false,
                                    timeBased: true,
                                    dateBased: false
                                }
                            ]
                        },
                        ids: []
                    });
                    setIsEditing(true);
                    setIsLoading(false);
                    return;
                }

                const data = await getDutyById(parseInt(id));
                setDutyData(data);
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

        fetchData();
        fetchUsers();
    }, [id]);

    const handleSave = async () => {
        if (dutyData) {
            try {
                let savedDuty;
                if (isCreating) {
                    savedDuty = await createDuty(dutyData);
                    navigate('/duties');
                } else {
                    savedDuty = await updateDuty(dutyData);
                }
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Duty | 'duration') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!dutyData) return;

        const value = event.target.value;
        let updatedData: Duty = { ...dutyData };

        switch (field) {
            case 'start_time':
                updatedData.start_time = value ? new Date(value) : new Date();
                break;
            case 'duration':
                const hours = parseFloat(value) || 0;
                updatedData.interval = {
                    ...updatedData.interval,
                    seconds: hours * 3600
                };
                break;
        }

        setDutyData(updatedData);
    };

    const handleUserChange = (event: React.SyntheticEvent, newValue: User[]) => {
        if (!dutyData) return;
        
        setDutyData({
            ...dutyData,
            ids: newValue.map(user => user.id)
        });
    };

    const getSelectedUsers = () => {
        return users.filter(user => dutyData?.ids.includes(user.id));
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание дежурства' : 'Детали дежурства'}</h1>
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
                            <Autocomplete
                                multiple
                                value={getSelectedUsers()}
                                onChange={handleUserChange}
                                options={users}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Сотрудники"
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
                                                    navigate('/duties');
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
                        <div>Дежурство не найдено</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default DutyDetailsPage; 
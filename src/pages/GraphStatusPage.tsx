import {useCallback, useEffect, useState} from "react";
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import {List, Paper, TextField, ListItem, ListItemText, CircularProgress} from "@mui/material";
import {getStatusGraphs, StatusGraph} from "src/services/mainService";
import {useNavigate} from "react-router-dom";
import {formTextFieldStyles} from "src/styles/formStyles";
const GraphStatusPage = () => {
    const [statusGraphs, setStatusGraphs] = useState<StatusGraph[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoading(true);
        getStatusGraphs().then((data) => {
            setIsLoading(false);
            return setStatusGraphs(data)
        });
    }, []);

// Состояние для хранения поискового запроса
    const [searchQuery, setSearchQuery] = useState('');
// Фильтрация элементов по поисковому запросу
    const filteredItems = statusGraphs.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Графы статусов</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/statusgraphs/new')}>Создать</Button>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3}
                       sx={{
                           backgroundColor: 'var(--card-background)', // Используем CSS-переменную
                           border: '1px solid var(--border-color)',
                           padding: '16px',
                       }}>
                    {/* Поле поиска */}
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        style={{marginBottom: '16px'}}
                        className={'textfield'}
                        sx={formTextFieldStyles}
                    />

                    {/* Список элементов */}
                    <List>
                        <>
                            {isLoading && <CircularProgress color="secondary" size={50} thickness={5}/>}
                            {filteredItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    className={'list-item'}
                                    onClick={() => navigate(`/statusgraphs/${item.id}`)}
                                >
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            ))}
                        </>
                    </List>
                </Paper>
            </div>

        </Layout>
    );
};
export default GraphStatusPage;

import {useCallback, useEffect, useState} from "react";
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import {List, Paper, TextField, ListItem, ListItemText, CircularProgress} from "@mui/material";
import {getStatusGraphs, StatusGraph} from "src/services/statusService";
import {useNavigate} from "react-router-dom";
import {formPaperStyles, formTextFieldStyles, listItemStyles} from "src/styles/formStyles";

const GraphStatusPage = () => {
    const [statusGraphs, setStatusGraphs] = useState<StatusGraph[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGraphs = async () => {
            setIsLoading(true);
            try {
                const data = await getStatusGraphs();
                setStatusGraphs(data);
            } catch (error) {
                console.error('Ошибка при загрузке графов статусов:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGraphs();
    }, []);

    const filteredGraphs = statusGraphs.filter((graph) =>
        graph.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        graph.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Графы статусов</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/graphs/new')}>Создать</Button>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginBottom: '16px' }}
                        className={'textfield'}
                        sx={formTextFieldStyles}
                    />

                    <List>
                        {isLoading && <CircularProgress color="secondary" size={50} thickness={5} />}
                        {filteredGraphs.map((graph) => (
                            <ListItem
                                key={graph.id}
                                className={'list-item'}
                                onClick={() => navigate(`/graphs/${graph.id}`)}
                                sx={listItemStyles}
                            >
                                <ListItemText
                                    primary={graph.name}
                                    secondary={graph.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </Layout>
    );
};

export default GraphStatusPage;

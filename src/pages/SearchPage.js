import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Rating, Stack, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Fuse from 'fuse.js';

const SearchPage = () => {
  const navigate = useNavigate();
  const [ searchText, setSearchText ] = useState("");
  const [ loading, setLoading ] = useState(true);
  const [ books, setBooks ] = useState([]);
  const [ searchBooks, setSearchBooks ] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) {
        navigate('/login')
      }
    }

    getUser();
  }, []);
                  //gets book data from the database
  useEffect(() => {
    setLoading(true);
    const getBook = async () => {
        const { data } = await supabase.from('books').select(`
        id,
        title,
        cover_image,
        author,
        pace,
        page_count,
        rating
      `);
      setBooks(data);
      setSearchBooks(data);
      setLoading(false);
    }
    getBook();
  }, []);
           //constructs a fuzzy search algorithm based on author and title
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
    if(!event.target.value) {
      setSearchBooks(books);
    } else {
      const options = {
        keys: ['author', 'title']
      }
      const fuse = new Fuse(books, options)
      const result = fuse.search(event.target.value)
      setSearchBooks(result.map(el => el.item));
    }
  }

  if(loading) {
    return null;
  }

  if(!books || books?.length <= 0 ) {
    return null;
  }

  return (
    <div>
      <Header title={"Search"} />
      <Box sx={{padding: "8px 8px 100px 8px"}}>
        <Stack spacing={2}>
          <TextField color="primary" label="Search" value={searchText} id="sign-up-search" onChange={handleSearchTextChange} variant="outlined" fullWidth />
          <Box>
            {
              (!books || books?.length <= 0) ? 
                <Typography sx={{fontSize: 20}}>No books were found</Typography> :
                <Stack spacing={4} >
                  {searchBooks.map(({id, title, author, rating, cover_image}) => {
                    return (
                      <Box sx={{height: 110 ,  }} key={id} onClick={() => {navigate(`/book/${id}`)}}>
                        <Paper sx={{ borderRadius: '20px',  height:110 ,  boxShadow: 'none' ,    backgroundColor: '#ffffff'  }}>
                          <Box sx={{display: 'flex', height: 100, width: '100%'  }}>
                            <Box sx={{width: 85 , height : 110}}>
                              <img src={cover_image} alt={title} style={{width: '100%', height: '100%' , borderRadius: 10 , boxShadow: '0px 4px 6px rgba(0, 0, 0 , 1)'}}/>
                            </Box>
                            <Box sx={{padding: '20px', width: '100%'}}>
                              <Grid container>
                                <Grid item xs={7}>
                                  <Stack spacing={1}>
                                    <Typography sx={{fontSize: 17 }}>{title}</Typography>
                                    <Typography sx={{fontSize: 13 }}>{author}</Typography>
                                  </Stack> 
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={3}>
                                  <Stack spacing={1}>
                                    <Typography sx={{fontSize: 15 , fontWeight:20}}>Rating</Typography>
                                    <Rating value={rating} size='small' readOnly name="rating"/>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    );
                  })}
                </Stack>
            }
          </Box>
        </Stack>
      </Box>
      <Footer/>
    </div>
  );
};

export default SearchPage;
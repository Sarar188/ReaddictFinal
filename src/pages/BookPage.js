import { Box, Button, Grid, Paper, Stack, Typography , Divider } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BookPage = () => {
  const navigate = useNavigate()
  const [ book, setBook ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const { bookId } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) {
        navigate('/login')
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getUserBook = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userBook } = await supabase.from('user_books').select(`
      id
      `)
      .eq('book_id', parseInt(bookId))
      .eq('user_id', user.id);
      console.log(userBook);
      if(userBook?.length > 0) {
        console.log("HERE");
        navigate(`/user-book/${userBook[0].id}`)
      }
    }

    getUserBook();
  }, [])

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
      `).eq('id', parseInt(bookId)).single();
      setBook(data);
      setLoading(false);
    }
    getBook();
  }, []);

  if(loading) {
    return null;
  }

  if(!book) {
    return null;
  }

   // navigates to the bookreadingpage when clicked
  const handleStartReading = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('user_books')
      .insert({ book_id: bookId, user_id: user.id })
      .select('id').single();
      navigate(`/user-book/${data.id}`);
  }

  return (
    <div>
      <Header 
        title={"Reading"} 
        leftIcon={
          <IconButton 
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <ArrowBack/>
          </IconButton>
        }
      />
      <Box sx={{padding: "10px" ,height: "100%"}}>
        <Stack spacing={5}>
          <Paper sx={{ height: "100%" ,   backgroundColor:"#ffebfd"}}>
            <Box sx={{display: 'flex'}}>
              <Box sx={{width: '35%' , height: '40%'}}>
                <img src={book.cover_image} alt={book.title} style={{width: '100%' ,borderRadius: 10 , boxShadow: '0px 4px 6px rgba(0, 0, 0 , 1)' }}/>
              </Box>
              <Box sx={{padding: '20px'}}>
                <Stack spacing={2}>
                  <Typography sx={{fontSize: 24 , }}>{book.title}</Typography>
                  <Typography sx={{fontsize: 14}}>{book.author}</Typography>
                </Stack>
               
              </Box>
            </Box>
            <Box sx={{padding: '10px'}}>
            <Grid container>
            <Grid item xs={4}>
                 
                <Stack spacing={1}>
                  <Typography align='center' sx={{fontSize: 17 }}>Rating</Typography>
                  <Typography align='center' sx={{fontSize: 17 }}>{book.rating}</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={4}>
             
                <Stack spacing={1}> 
                  <Typography align='center' sx={{fontSize: 17 }}>Pages</Typography>
                  <Typography align='center' sx={{fontSize: 17 }}>{book.page_count}</Typography>
                </Stack>
              
            </Grid>
            <Grid item xs={4}>
              
                <Stack spacing={1}>
                  <Typography align='center' sx={{fontSize: 17 }}>Pace</Typography>
                  <Typography align='center' sx={{fontSize: 17 }}>{book.pace}</Typography>
                </Stack>
              
            </Grid>
          </Grid>
          </Box>
          </Paper>
          
          <Box>
            <Button color="primary" variant="contained" fullWidth onClick={handleStartReading}><Typography sx={{ fontSize: 18}}>Start Reading</Typography></Button>
          </Box>
        </Stack>
      </Box>
    </div>
  );
};

export default BookPage;
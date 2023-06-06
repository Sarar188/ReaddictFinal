import { Stack, Paper, Typography, LinearProgress, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const HomeGoals = () => {
  const [ userGoal, setGoal ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();

     //gets the info from the user_goals and if the user column = id sets the data

  useEffect(() => {
    setLoading(true);
    const getGoal = async () => {
      const { data: { user } } = await supabase.auth.getUser()  //gets the user information, and assigns it to var user
      const { data } = await supabase.from('user_goals').select(`  
        id,
        goal,
        progress,
        streak
      `).eq('user', user.id).single();
      setGoal(data);
      
      setLoading(false);
    }
    

    getGoal();
  }, [])

  if(loading) {
    return null;
  }

      //gets the progress/Goal from the userGoal object turn it into percentage

  const getProgressPercentage = () => {
    const { progress, goal } = userGoal
    return Math.trunc((progress / goal) * 100);
  }
  
     //No goals show add goal text

  if(!userGoal) {
    return (
      <Box sx={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <Button variant='contained' color="primary" fullWidth onClick={() => {navigate('/add-goal')}}>Add Goal</Button>
      </Box>
    );
  }
      // Goal set show the streak / goal box

  return (
    <Stack spacing={2}>
      <Paper sx={{padding: "16px 12px" , backgroundColor: '#ffd6fb'}}>
        <Stack spacing={2}>
          <Typography sx={{fontSize: 19 , fontWeight: '300'}}>Your 2023 Resolution</Typography>
          
            <LinearProgress value={getProgressPercentage()} variant="determinate" color="primary"/>
            <Typography sx={{fontSize: 18, color: "#49454F"}}>{userGoal.progress}/{userGoal.goal}</Typography>
          
        </Stack>
      </Paper>
      <Paper sx={{padding: "16px 12px" , backgroundColor: '#ffd6fb'}}>
        <Typography sx={{fontSize: 20 , fontWeight: '300'}}>Your Reading Streak</Typography>
        <Typography sx={{fontSize: 17, color: "#49454F"}}>{userGoal.streak} Days Streak</Typography>
      </Paper>
    </Stack>
  );
}

export default HomeGoals;
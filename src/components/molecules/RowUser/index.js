import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Collapse,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useDispatch } from "react-redux";

const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });
  
const RowUser = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = props;
  let vehicles = Object.keys(users.vehicles).map((k) => users.vehicles[k])
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const handleClickVehicle = (e) => {
    dispatch({type: 'SEARCH', value: e})
    navigate('/app/vehicles')
  };
  
  return (
    <Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{users.namaLengkap}</TableCell>
        <TableCell>{users.tanggalLahir}</TableCell>
        <TableCell>{users.email}</TableCell>
        <TableCell>{users.alamat}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box >
                <Grid container spacing={0}>

                {vehicles.map(vehicle => {
                return(
                  <Grid item xs={6}>
                  <Card>
                    <CardActionArea onClick={() => handleClickVehicle(vehicle.NOMOR_MESIN)}>
                      <CardContent>
                        <Grid container spacing={3} >
                          <Grid item> 
                            <Typography color="textSecondary" gutterBottom variant="h6" >
                              {vehicle.JENIS_KB}
                            </Typography>
                            <Typography color="textPrimary" variant="h3" >
                              {vehicle.NOMOR_MESIN}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            pt: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Typography sx={{ mr: 1 }} variant="body2">
                            {vehicle.KODE_DAERAH_NOMOR_POLISI + ' ' + vehicle.NOMOR_POLISI + ' ' + vehicle.KODE_LOKASI_NOMOR_POLISI}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  </Grid>
                 )})}
                </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default RowUser
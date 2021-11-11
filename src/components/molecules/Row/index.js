import React, { useState, Fragment } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  InputAdornment,
  IconButton,
  Snackbar,
  TextField,
  TableCell,
  TableRow,
  Collapse,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../config/firebase';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from "react-redux";


const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    adornedStart: {
      width: "26px",
    }
  });


  
const Row = (props) => {
    const dispatch = useDispatch();
    const { vehicle, index } = props;
    const [selectedVehicle, setSelectedVehicle] = useState(vehicle)
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();

    //Flash Message
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const handleClickAlert = (message, severity) => {
        setSeverity(severity);
        setAlertMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpenAlert(false);
    };
    //-----------

    const handleClickOpen = () => {
      setOpenDialog(true);
    };

    const handleClose = (value) => {
      setOpenDialog(false);
      setSelectedValue(value);
    };

    //Delete Dialog
    function DeleteConfirm(props) {
      const dispatch = useDispatch();
      const { onClose, selectedValue, open } = props;
    
      const handleClose = () => {
        onClose(selectedValue);
      };
    
      const handleYes = () => {
        firebase
          .database()
            .ref(`/deleted/Kendaraan/${props.selectedValue.vehicle.NO}`)
              .set(props.selectedValue.vehicle)
                .then(()=>{
                  firebase
                    .database()
                      .ref(`/Kendaraan/${props.selectedValue.vehicle.NO}`)
                        .set(null)
                          .then(() => {
                            handleClickAlert("Vehicle Removed.", "success")
                            onClose(selectedValue)
                          })
                        })
                        
      }
    
      return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" fontSize={18}>{"Are you sure?"}</DialogTitle>
            <DialogActions>
              <Button onClick={handleYes} variant="contained" color="primary"> Yes </Button>
              <Button onClick={handleClose} color="primary" autoFocus> No </Button>
            </DialogActions>
          </Dialog>
      );
    }
    //---------------

    const handleSubmit = (e) => {
      var handleSubmitVehicle = selectedVehicle;
      firebase
        .database()
          .ref(`Kendaraan/${handleSubmitVehicle.NO}`)
            .set(handleSubmitVehicle)
              .then(() => {
                firebase
                  .database()
                    .ref('Users')
                      .on("value", (res)=>{
                        res.forEach((childRes)=>{
                          var uid = childRes.val().uid
                          var vehicles = childRes.val().vehicles
                          Object.values(vehicles).map((veh)=>{
                            if(veh.NOMOR_MESIN === handleSubmitVehicle.NOMOR_MESIN){
                              handleSubmitVehicle["FOTO_KENDARAAN"] = veh.FOTO_KENDARAAN;
                              firebase
                                .database()
                                  .ref(`Users/${uid}/vehicles/${handleSubmitVehicle.NOMOR_MESIN}/`)
                                    .set(handleSubmitVehicle)
                                      .then(() => {
                                        firebase
                                          .database()
                                            .ref('users')
                                              .off('value')
                                      })
                            }
                          })
                        })
                      })
                handleClickAlert("Edit Successful.", "success")
              })

      e.preventDefault();
    }
    
    return (
      <Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">{vehicle.NO}</TableCell>
          <TableCell >{vehicle.NOMOR_MESIN}</TableCell>
          <TableCell >{vehicle.NAMA_PEMILIK}</TableCell>
          <TableCell >{vehicle.JT_PAJAK}</TableCell>
          <TableCell >{vehicle.NOPOL}</TableCell>
          <TableCell > {vehicle.NO_TELEPON} </TableCell>
          <TableCell> <Button size="small" onClick={() => handleClickOpen()}> <DeleteIcon/> </Button> </TableCell>
          <DeleteConfirm selectedValue={{vehicle, index}} open={openDialog} onClose={handleClose} />
          <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={severity}>
                {alertMessage}
            </Alert>
          </Snackbar>
        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={0} spacing={2}>
                <form onSubmit={handleSubmit}>
                  <TextField size="small" variant="outlined" defaultValue={vehicle.NO} id="NO" fullWidth disabled 
                    InputProps={{startAdornment:<InputAdornment position="start">No: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NOMOR_MESIN} id="NOMOR_MESIN" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NOMOR_MESIN: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nomor Mesin: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NAMA_PEMILIK} id="NAMA_PEMILIK" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NAMA_PEMILIK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nama Pemilik: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.JT_PAJAK} id="JT_PAJAK" fullWidth
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, JT_PAJAK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Berlaku Sampai Dengan: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NOPOL} id="NOPOL" fullWidth
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NOPOL: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nomor Polisi: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.ALAMAT_PEMILIK} id="ALAMAT_PEMILIK" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, ALAMAT_PEMILIK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Alamat Pemilik: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.JENIS} id="JENIS" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, JENIS: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Jenis: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.KODE_JENIS} id="KODE_JENIS" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, KODE_JENIS: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Kode Jenis: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.KODE_MEREK} id="KODE_MEREK" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, KODE_MEREK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Kode MEREK: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.MEREK} id="MEREK" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, MEREK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Merek: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.KODE_TIPE} id="KODE_TIPE" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, KODE_TIPE: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Kode Tipe: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NOMOR_RANGKA} id="NOMOR_RANGKA" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NOMOR_RANGKA: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nomor Rangka: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.PKB} id="PKB" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, PKB: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">PKB: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NO_TELEPON} id="NO_TELEPON" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NO_TELEPON: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">No. Telp: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.TAHUN_BUAT} id="TAHUN_BUAT" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, TAHUN_BUAT: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Tahun Buat: </InputAdornment>}}/>
                  <Grid container spacing={3} >
                    <Grid item md={12}>
                      <TextField size="small" variant="outlined" defaultValue={vehicle.WTNKB} id="WTNKB" fullWidth 
                        onChange={(e) => setSelectedVehicle({...selectedVehicle, WTNKB: e.target.value.toUpperCase()})}
                        InputProps={{startAdornment:<InputAdornment position="start">WTNKB: </InputAdornment>}}/>
                    </Grid>
                    <Grid item md={1}>
                      <Button type="submit" variant="contained">Save</Button>
                    </Grid>

                  </Grid>
                </form>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    )
  }

  export default Row
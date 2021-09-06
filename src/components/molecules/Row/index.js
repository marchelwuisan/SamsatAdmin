import React, { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  Input,
  InputAdornment,
  InputBase,
  IconButton,
  Snackbar,
  SvgIcon,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableSortLabel,
  Tooltip,
  FormControl,
  FormControlLabel,
  InputLabel,
  FormHelperText,
  Collapse,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TablePagination from "@material-ui/core/TablePagination";
import { Search as SearchIcon } from 'react-feather';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../config/firebase';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from "react-redux";


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
        console.log("handleYes: ", props.selectedValue)
        firebase
          .database()
            .ref(`/deleted/vehicles/${props.selectedValue.vehicle.NO - 1}`)
              .set(props.selectedValue.vehicle)
                .then(()=>{
                  firebase
                    .database()
                      .ref(`/vehicles/${props.selectedValue.vehicle.NO - 1}`)
                        .set(null)
                          .then(()=>{
                            dispatch({type: 'DELETE_VEHICLE', value:props.selectedValue.vehicle.NO})
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
      console.log("handleSubmitVehicle: ", handleSubmitVehicle)
      firebase
        .database()
          .ref(`/vehicles/${handleSubmitVehicle.NO - 1}/`)
            .set(handleSubmitVehicle)
              .then(() => {
                firebase
                  .database()
                    .ref('users')
                      .on("value", (res)=>{
                        res.forEach((childRes)=>{
                          var uid = childRes.val().uid
                          var vehicles = childRes.val().vehicles
                          Object.values(vehicles).map((veh)=>{
                            if(veh.NOMOR_MESIN === handleSubmitVehicle.NOMOR_MESIN){
                              console.log("veh: ", veh)
                              handleSubmitVehicle["FOTO_KENDARAAN"] = veh.FOTO_KENDARAAN;
                              console.log("gottem: ", handleSubmitVehicle)
                              firebase
                                .database()
                                  .ref(`users/${uid}/vehicles/${handleSubmitVehicle.NOMOR_MESIN}/`)
                                    .set(handleSubmitVehicle)
                                      .then(() => {
                                        firebase
                                          .database()
                                            .ref('users')
                                              .off('value')
                                      })
                            }
                          })
                          console.log("childRes: ", childRes.val())
                        })
                      })
                handleClickAlert("Edit Successful.", "success")
              //  dispatch({type: 'EDIT_VEHICLE', value:selectedVehicle})
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
          <TableCell component="th" scope="row"> {vehicle.index} </TableCell>
          <TableCell >{vehicle.NOMOR_MESIN}</TableCell>
          <TableCell >{vehicle.NAMA_PEMILIK}</TableCell>
          <TableCell >{vehicle.tanggalBerlaku}</TableCell>
          <TableCell >{vehicle.nomorPolisi}</TableCell>
          <TableCell> <Button size="small" onClick={() => handleClickOpen(vehicle.NO)}> <DeleteIcon/> </Button> </TableCell>
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

                  <TextField size="small" variant="outlined" defaultValue={vehicle.TANGGAL_BERLAKU_SD} id="TANGGAL_BERLAKU_SD" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, TANGGAL_BERLAKU_SD: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Tanggal Berlaku Sampai Dengan: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.BULAN_BERLAKU_SD} id="BULAN_BERLAKU_SD" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, BULAN_BERLAKU_SD: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Bulan Berlaku Sampai Bulan: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.TAHUN_BERLAKU_SD} id="TAHUN_BERLAKU_SD" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, TAHUN_BERLAKU_SD: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Tahun Berlaku Sampai Dengan: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.KODE_DAERAH_NOMOR_POLISI} id="KODE_DAERAH_NOMOR_POLISI" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, KODE_DAERAH_NOMOR_POLISI: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Kode Daerah Nomor Polisi: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NOMOR_POLISI} id="NOMOR_POLISI" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NOMOR_POLISI: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nomor Polisi: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.KODE_LOKASI_NOMOR_POLISI} id="KODE_LOKASI_NOMOR_POLISI" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, KODE_LOKASI_NOMOR_POLISI: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Kode Lokasi Nomor Polisi: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.ALAMAT_PEMILIK} id="ALAMAT_PEMILIK" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, ALAMAT_PEMILIK: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Alamat Pemilik: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.BAHAN_BAKAR} id="BAHAN_BAKAR" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, BAHAN_BAKAR: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Bahan Bakar: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.ISI_SILINDER} id="ISI_SILINDER" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, ISI_SILINDER: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Isi Silinder: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.JENIS_KB} id="JENIS_KB" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, JENIS_KB: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Jenis KB: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.MEREK_KB} id="MEREK_KB" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, MEREK_KB: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Merek KB: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.MODEL_KB} id="MODEL_KB" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, MODEL_KB: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Model KB: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.NOMOR_RANGKA} id="NOMOR_RANGKA" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, NOMOR_RANGKA: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Nomor Rangka: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.PKB_TERAKHIR} id="PKB_TERAKHIR" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, PKB_TERAKHIR: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">PKB Terakhir: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.PLAT} id="PLAT" fullWidth 
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, PLAT: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Plat: </InputAdornment>}}/>

                  <TextField size="small" variant="outlined" defaultValue={vehicle.TAHUN_BUAT} id="TAHUN_BUAT" fullWidth type="number"
                    onChange={(e) => setSelectedVehicle({...selectedVehicle, TAHUN_BUAT: e.target.value.toUpperCase()})}
                    InputProps={{startAdornment:<InputAdornment position="start">Tahun Buat: </InputAdornment>}}/>
                  <Grid container spacing={3} >
                    <Grid item md={12}>
                      <TextField size="small" variant="outlined" defaultValue={vehicle.TYPE_KB} id="TYPE_KB" fullWidth 
                        onChange={(e) => setSelectedVehicle({...selectedVehicle, TYPE_KB: e.target.value.toUpperCase()})}
                        InputProps={{startAdornment:<InputAdornment position="start">Tipe KB: </InputAdornment>}}/>
                    </Grid>
                    <Grid item md={1}>
                      <Button type="submit" variant="contained">Save</Button>
                    </Grid>

                  </Grid>
                </form>
                {/* <Typography variant="h6" gutterBottom component="div"> NO: {vehicle.NO} </Typography>
                <Typography variant="h6" gutterBottom component="div"> NOMOR_MESIN: {vehicle.NOMOR_MESIN} </Typography>
                <Typography variant="h6" gutterBottom component="div"> NAMA_PEMILIK: {vehicle.NAMA_PEMILIK} </Typography>
                <Typography variant="h6" gutterBottom component="div"> NOMOR_POLISI: {vehicle.NOMOR_POLISI} </Typography>
                <Typography variant="h6" gutterBottom component="div"> ALAMAT_PEMILIK: {vehicle.ALAMAT_PEMILIK} </Typography>
                <Typography variant="h6" gutterBottom component="div"> BAHAN_BAKAR: {vehicle.BAHAN_BAKAR} </Typography>
                <Typography variant="h6" gutterBottom component="div"> ISI_SILINDER: {vehicle.ISI_SILINDER} </Typography>
                <Typography variant="h6" gutterBottom component="div"> JENIS_KB: {vehicle.JENIS_KB} </Typography>
                <Typography variant="h6" gutterBottom component="div"> MEREK_KB: {vehicle.MEREK_KB} </Typography>
                <Typography variant="h6" gutterBottom component="div"> MODEL_KB: {vehicle.MODEL_KB} </Typography>
                <Typography variant="h6" gutterBottom component="div"> NOMOR_RANGKA: {vehicle.NOMOR_RANGKA} </Typography>
                <Typography variant="h6" gutterBottom component="div"> PKB_TERAKHIR: {vehicle.PKB_TERAKHIR} </Typography>
                <Typography variant="h6" gutterBottom component="div"> PLAT: {vehicle.PLAT} </Typography>
                <Typography variant="h6" gutterBottom component="div"> TAHUN_BUAT: {vehicle.TAHUN_BUAT} </Typography>
                <Typography variant="h6" gutterBottom component="div"> TYPE_KB: {vehicle.TYPE_KB} </Typography> */}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    )
  }

  export default Row
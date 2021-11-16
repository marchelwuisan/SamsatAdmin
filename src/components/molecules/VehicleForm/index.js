import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  ClickAwayListener,
  Collapse,
  Grid,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { useForm } from '../../../utils'
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../config/firebase';
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VehicleForm = () => {
    const dispatch = useDispatch();
    let totalVehicle = useSelector(state => state.totalVehicle);
    let vehicles = useSelector(state => state.vehicles);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const handleClickAlert = (message, severity) => {
        setSeverity(severity);
        setAlertMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpenAlert(false);
    };
    const handleDateChange = (e) => {
        setForm('JT_PAJAK', `${e.getDate()}/${e.getMonth()}/${e.getFullYear()}`)
        setIsChecked(!isChecked);
    };


    useEffect(() => {
        firebase
            .database()
                .ref(`/_TotalVehicle/`)
                    .once('value')
                    .then(res => {
                        dispatch({type: 'TOTAL_VEHICLE', value:res.val()})
                        
                        })
    }, [])

    const [form, setForm] = useForm({
        NOMOR_MESIN: '',
        NOPOL: '',
        NAMA_PEMILIK: '',
        JT_PAJAK: '',
        ALAMAT_PEMILIK: '',
        JENIS: '',
        KODE_JENIS: '',
        KODE_MEREK: '',
        KODE_TIPE: '',
        NOMOR_RANGKA: '',
        PKB: '',
        NO_TELEPON: '',
        TAHUN_BUAT: '',
        WTNKB: '',
      });

    const handleSubmit = (e) => {

        form["NO"] = totalVehicle;
        console.log("form: ", form)

        firebase
        .database()
        .ref(`Kendaraan/${totalVehicle}/`)
        .set(form)
        .then(() => {
            firebase
            .database()
            .ref(`/_TotalVehicle/`)
            .set(totalVehicle + 1)
                    .then(() => {
                        firebase
                        .database()
                        .ref(`/_TotalVehicle/`)
                            .once('value')
                            .then(res => {
                                form["index"] = vehicles.length;
                                dispatch({type: 'TOTAL_VEHICLE', value: res.val()})
                                // dispatch({type: 'ADD_VEHICLE', value: form})
                                setForm('reset')
                                handleClickAlert("Vehicle Submitted.", "success")
                            })
                            .catch(error => {
                                handleClickAlert(error.message, "error")
                            });
                    })

            })

        e.preventDefault(); 
    }

    return(
        <>
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>

                <Typography variant="h4" gutterBottom>
                Tambah Kendaraan
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOMOR_MESIN" label="Nomor Mesin" fullWidth value={form.NOMOR_MESIN}
                        onChange={(e) => setForm('NOMOR_MESIN', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOPOL" label="Nomor Polisi" fullWidth value={form.NOPOL}
                        onChange={(e) => setForm('NOPOL', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NAMA_PEMILIK" label="Nama Pemilik" fullWidth value={form.NAMA_PEMILIK}
                        onChange={(e) => setForm('NAMA_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="JT_PAJAK" label="Berlaku Sampai Dengan" fullWidth value={form.JT_PAJAK} onClick={() => { setIsChecked((prev) => !prev); }}
                        onChange={(e) => setForm('JT_PAJAK', e.target.value)} InputLabelProps={{ required: false }} inputProps={{ readOnly: true, }}/>
                    <Collapse in={isChecked}>
                        <DatePicker dateFormat="dd/MM/yyyy" inline onChange={(e) => handleDateChange(e)} showMonthDropdown showYearDropdown dropdownMode="select" />
                    </Collapse>
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField size="small" required id="ALAMAT_PEMILIK" multiline label="Alamat Pemilik" fullWidth value={form.ALAMAT_PEMILIK}
                        onChange={(e) => setForm('ALAMAT_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="JENIS" label="Jenis" fullWidth value={form.JENIS}
                        onChange={(e) => setForm('JENIS', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="KODE_JENIS" type="number" label="Kode Jenis" fullWidth value={form.KODE_JENIS}
                        onChange={(e) => setForm('KODE_JENIS', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="MEREK" label="Merek" fullWidth value={form.MEREK}
                        onChange={(e) => setForm('MEREK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="KODE_MEREK" type="number" label="Kode Merek" fullWidth value={form.KODE_MEREK}
                        onChange={(e) => setForm('KODE_MEREK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="KODE_TIPE" type="number" label="Kode Tipe" fullWidth value={form.KODE_TIPE}
                        onChange={(e) => setForm('KODE_TIPE', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOMOR_RANGKA" label="Nomor Rangka" fullWidth value={form.NOMOR_RANGKA}
                        onChange={(e) => setForm('NOMOR_RANGKA', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="PKB" label="PKB" fullWidth value={form.PKB}
                        onChange={(e) => setForm('PKB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NO_TELEPON" label="Nomor Telpon" fullWidth value={form.NO_TELEPON}
                        onChange={(e) => setForm('NO_TELEPON', e.target.value)} InputProps={{ inputProps: {  max: 3000, min: 1800  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="TAHUN_BUAT" type="number" label="Tahun Buat" fullWidth value={form.TAHUN_BUAT}
                        onChange={(e) => setForm('TAHUN_BUAT', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="WTNKB" label="WTNKB" fullWidth value={form.WTNKB}
                        onChange={(e) => setForm('WTNKB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained"> Submit </Button>
                </Grid>
                </Grid>
                </form>
            </CardContent>
        </Card>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={severity}>
                {alertMessage}
            </Alert>
      </Snackbar>
        </>
    )
}

export default VehicleForm
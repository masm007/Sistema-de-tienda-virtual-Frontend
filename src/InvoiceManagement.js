import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Paper,
  TableContainer,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Snackbar,
  TextField,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  Slide,
  LinearProgress,
} from '@mui/material';

import {
  IconPlus,
  IconId,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconRefresh,
  IconUsers,
  IconAlertTriangle,
  IconCheck,
  IconExclamationMark,
  IconCash,
} from '@tabler/icons';

// 🔧 IMPORTS CORREGIDOS - Rutas correctas según estructura real
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomOutlinedButton from '../../components/forms/theme-elements/CustomOutlinedButton';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { get } from 'lodash';
import { use } from 'react';

// 🎨 Transition component para diálogos
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InvoiceManagement = () => {
  const navigate = useNavigate();
  // 📋 Estados del componente
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [paymentsTypes, setPaymentsTypes] = useState([]);
  const [personas, setPersonas] = useState([]); // Estado para personas
  const [payments, setPayments] = useState([]);

  const [datosTablaPrd, setDatosTablaPrd] = useState([]); // Estado para datos de la tabla
  const [datosTablaTax, setDatosTablaTax] = useState([]); // Estado para datos de la tabla
  const [datosTablaPagos, setDatosTablaPagos] = useState([]); // Estado para datos de la tabla
  const [banderaModalProductos, setBanderaModalProductos] = useState(false);
  const [banderaModalImpuestos, setBanderaModalImpuestos] = useState(false);
  const [banderaModalPagos, setBanderaModalPagos] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 📋 Estados para formularios
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedInvoice, setInvoice] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    pro_id: '',
    pro_name: '',
    //cantidad es aparte
    pro_price: '',
    pro_total_sessions: '',
    // total es calculado
  });
  const [taxSeleccionado, setTaxSeleccionado] = useState({
    tax_id: '',
    tax_name: '',
    tax_percentage: '',
    tax_description: '',
    // total es calculado
  });
  const [pagoSeleccionado, setPagoSeleccionado] = useState({
    inp_proof_image_path: '',
    inp_payment_method_id: '',
    inp_amount: '',
    inp_reference: '',
  });

  // 🗑️ Estados para confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    invoice: null,
    loading: false,
  });

  // 📋 Estados para mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // 📋 Estados del formulario
  const [formData, setFormData] = useState({
    inv_id: '', // solo en modo edición
    inv_client_id: '',
    inv_patient_id: '',
    inv_subtotal: 0.0,
    inv_discount: 0.0,
    inv_tax: 0.0,
    inv_grand_total: 0.0,
    details: datosTablaPrd, // productos agregados
    taxes: datosTablaTax, // impuestos aplicados
    payments: [], // inicial: 1 pago, luego: múltiples cuotas
  });

  const [formDataPago, setFormDataPago] = useState({
    inp_payment_method_id: '', // método de pago
    inp_amount: '', // monto
    inp_reference: '', // referencia opcional
    inp_proof_image_path: '', // comprobante opcional
  });

  // 🔄 Estados para validación
  const [errors, setErrors] = useState({});
  const [debugInfo, setDebugInfo] = useState({
    tokenExists: false,
    tokenLength: 0,
    invoicesLoaded: 0,
    patientsLoaded: 0,
    productsLoaded: 0,
    taxesLoaded: 0,
    paymentsTypesLoaded: 0,
    paymentsLoaded: 0,
    clientsLoaded: 0,
    lastLoad: null,
  });

  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchLoading, setCLientSearchLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);

  // 🍞 Breadcrumb
  const BCrumb = [
    { to: '/', title: 'Inicio' },
    { to: '/security', title: 'Administracion' },
    { title: 'Gestión Administrativa' },
  ];

  // 🔧 FUNCIÓN: Obtener token con validación
  const getAuthToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ No se encontró token en localStorage');
      showSnackbar('Error: No hay token de autenticación. Inicie sesión nuevamente.', 'error');
      return null;
    }

    console.log('✅ Token encontrado, longitud:', token.length);

    setDebugInfo((prev) => ({
      ...prev,
      tokenExists: true,
      tokenLength: token.length,
    }));
    return token;
  };

  // 🔧 FUNCIÓN: Headers estándar para todas las peticiones
  const getRequestHeaders = () => {
    const token = getAuthToken();
    if (!token) return null;

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      tokenapp: token,
    };
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    console.log('🧪 Usuario actual recuperado:', user);
    return user || null;
  };

  useEffect(() => {
    const nuevoSubtotal = datosTablaPrd.reduce((acc, item) => acc + Number(item.total || 0), 0);
    setFormData((prev) => ({ ...prev, inv_subtotal: nuevoSubtotal.toFixed(2) }));
  }, [datosTablaPrd]);

  useEffect(() => {
    const subtotal = parseFloat(formData.inv_subtotal || 0);
    const totalImpuestos = datosTablaTax.reduce((acc, tax) => {
      const porcentaje = Number(tax.tax_percentage || 0);
      return acc + (subtotal * porcentaje) / 100;
    }, 0);
    setFormData((prev) => ({ ...prev, inv_tax: totalImpuestos.toFixed(2) }));
  }, [datosTablaTax, formData.inv_subtotal]);

  useEffect(() => {
    const subtotal = parseFloat(formData.inv_subtotal || 0);
    const impuestos = parseFloat(formData.inv_tax || 0);
    const descuento = parseFloat(formData.inv_discount || 0);
    const total = subtotal + impuestos - descuento;

    setFormData((prev) => ({
      ...prev,
      inv_grand_total: total.toFixed(2),
    }));
  }, [formData.inv_subtotal, formData.inv_tax, formData.inv_discount]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      details: datosTablaPrd,
    }));
  }, [datosTablaPrd]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      taxes: datosTablaTax,
    }));
  }, [datosTablaTax]);

  // 🔄 Cargar datos iniciales
  useEffect(() => {
    console.log('🔄 Componente InvoiceManagement montado');
    loadInitialData();
  }, []);

  // 🔧 FUNCIÓN: Cargar todos los datos iniciales
  const loadInitialData = async () => {
    console.log('🔄 Iniciando carga de datos iniciales...');

    const token = getAuthToken();
    if (!token) {
      showSnackbar('Error de autenticación. Redirigiendo al login...', 'error');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 3000);
      return;
    }

    setLoading(true);
    try {
      await Promise.all([
        loadInvoices(),
        loadPatients(),
        loadClients(),
        loadProducts(),
        loadTaxes(),
        loadPaymentsTypes(),
        loadPayments(),
        loadPersonas(),
      ]);

      setDebugInfo((prev) => ({
        ...prev,
        lastLoad: new Date().toLocaleTimeString(),
      }));
    } catch (error) {
      console.error('❌ Error en carga inicial:', error);
      showSnackbar('Error al cargar datos iniciales', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 📥 FUNCIÓN: Cargar facturas
  const loadInvoices = async () => {
    console.log('🔄 Iniciando carga de facturas...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/invoice/list', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta facturas - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta de facturas:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de facturas recibidos:', data);

      if (data.result && data.data && Array.isArray(data.data.data) && data.data.data.length > 0) {
        setInvoices(data.data.data);
        setDebugInfo((prev) => ({ ...prev, invoicesLoaded: data.data.data.length }));
        console.log(`✅ ${data.data.data.length} facturas cargadas`);
      } else {
        console.warn('⚠️ Respuesta de facturas sin datos válidos:', data);
        setInvoices([]);
        showSnackbar('No se encontraron facturas', 'warning');
      }
    } catch (error) {
      console.error('❌ Error completo cargando las facturas:', error);
      showSnackbar(`Error al cargar las facturas: ${error.message}`, 'error');
      setInvoices([]);
    }
  };

  // 📥 FUNCIÓN: Cargar pacientes
  const loadPatients = async () => {
    console.log('🔄 Iniciando carga de pacientes...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/patients/list', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta pacientes - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta pacientes:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de pacientes recibidos:', data);

      if (data.result && data.data && Array.isArray(data.data.data)) {
        setPatients(data.data.data);
        setDebugInfo((prev) => ({ ...prev, patientsLoaded: data.data.data.length }));
        console.log(`✅ ${data.data.data.length} pacientes cargados`);
      } else {
        console.warn('⚠️ Respuesta pacientes sin datos válidos');
        setPatients([]);
      }
    } catch (error) {
      console.error('❌ Error cargando pacientes:', error);
      showSnackbar(`Error al cargar pacientes: ${error.message}`, 'warning');
      setPatients([]);
    }
  };

  // 📥 FUNCIÓN: Cargar personas
  const loadPersonas = async () => {
    console.log('🔄 Iniciando carga de personas...');

    try {
      const headers = getRequestHeaders();
      if (!headers) {
        console.error('❌ No se pudieron obtener headers válidos');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/admin/persons/list', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'no-cache',
      });

      console.log('📡 Status de respuesta personas:', response.status);

      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log('✅ Respuesta completa del backend:', data);

        if (data.result === true) {
          let personsArray = null;

          // Manejar estructura anidada
          if (data.data && Array.isArray(data.data)) {
            personsArray = data.data;
          } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
            if (data.data.result === true) {
              personsArray = data.data.data;
            } else {
              console.error('❌ Resultado interno es false:', data.data.message);
              showSnackbar(
                `Error interno del servidor: ${data.data.message || 'Sin mensaje'}`,
                'error',
              );
              setPersonas([]);
              return;
            }
          } else {
            console.error('❌ Estructura de datos no reconocida');
            showSnackbar('Error: Estructura de datos no reconocida del servidor', 'error');
            setPersonas([]);
            return;
          }

          if (personsArray && Array.isArray(personsArray)) {
            setPersonas(personsArray);
            setDebugInfo((prev) => ({ ...prev, personsLoaded: personsArray.length }));
            console.log('✅ Personas asignadas al estado correctamente');
            showSnackbar(`${personsArray.length} personas cargadas correctamente`, 'success');
          } else {
            console.error('❌ No se pudo obtener array válido de personas');
            setPersonas([]);
            showSnackbar('Error: No se encontraron datos válidos de personas', 'error');
          }
        } else {
          console.error('❌ Result principal es false:', data.message);
          setPersonas([]);
          showSnackbar(`Error del servidor: ${data.message || 'Sin mensaje de error'}`, 'error');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error HTTP en personas:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });

        if (response.status === 401 || response.status === 403) {
          showSnackbar('Error de autenticación. Token inválido o expirado.', 'error');
          localStorage.removeItem('token');
          setTimeout(() => (window.location.href = '/auth/login'), 2000);
        } else {
          showSnackbar(`Error HTTP ${response.status}: ${errorText}`, 'error');
        }

        setPersonas([]);
      }
    } catch (error) {
      console.error('❌ Error COMPLETO en loadPersons:', error);

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showSnackbar('Error de red. Verifique la conexión con el backend.', 'error');
      } else if (error.name === 'SyntaxError') {
        showSnackbar('Error de formato en respuesta del servidor.', 'error');
      } else {
        showSnackbar(`Error inesperado: ${error.message}`, 'error');
      }

      setPersonas([]);
    }
  };

  // 📥 FUNCIÓN: Cargar productos
  const loadProducts = async () => {
    console.log('🔄 Iniciando carga de productos...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/products/list', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta productos - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta productos:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de productos recibidos:', data);

      if (data.result && Array.isArray(data.data)) {
        setProducts(data.data);
        setDebugInfo((prev) => ({ ...prev, productsLoaded: data.data.length }));
        console.log(`✅ ${data.data.length} productos cargados`);
      } else {
        console.warn('⚠️ Respuesta productos sin datos válidos');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      showSnackbar(`Error al cargar productos: ${error.message}`, 'warning');
      setProducts([]);
    }
  };

  // 📥 FUNCIÓN: Cargar impuestos
  const loadTaxes = async () => {
    console.log('🔄 Iniciando carga de impuestos...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/taxes', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta impuestos - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta impuestos:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de impuestos recibidos:', data);

      if (data.result && Array.isArray(data.data)) {
        setTaxes(data.data);
        setDebugInfo((prev) => ({ ...prev, taxesLoaded: data.data.length }));
        console.log(`✅ ${data.data.length} impuestos cargados`);
      } else {
        console.warn('⚠️ Respuesta impuestos sin datos válidos');
        setTaxes([]);
      }
    } catch (error) {
      console.error('❌ Error cargando impuestos:', error);
      showSnackbar(`Error al cargar impuestos: ${error.message}`, 'warning');
      setTaxes([]);
    }
  };

  // 📥 FUNCIÓN: Cargar pagos
  const loadPayments = async () => {
    console.log('🔄 Iniciando carga de pagos...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/invoice/payment/list', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta pagos - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta pagos:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de pagos recibidos:', data);

      if (data.result && data.data && Array.isArray(data.data.data)) {
        setPayments(data.data.data);
        setDebugInfo((prev) => ({ ...prev, paymentsLoaded: data.data.data.length }));
        console.log(`✅ ${data.data.data.length} pagos cargados`);
      } else {
        console.warn('⚠️ Respuesta pagos sin datos válidos');
        setPayments([]);
      }
    } catch (error) {
      console.error('❌ Error cargando pagos:', error);
      showSnackbar(`Error al cargar pagos: ${error.message}`, 'warning');
      setPayments([]);
    }
  };

  // 📥 FUNCIÓN: Cargar tipos de pagos
  const loadPaymentsTypes = async () => {
    console.log('🔄 Iniciando carga de tipos de pagos...');

    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const response = await fetch('http://127.0.0.1:5000/admin/PaymentMethod/list', {
        method: 'GET',
        headers: headers,
      });

      console.log('📡 Respuesta tipos de pagos - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta tipos de pagos:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de tipos de pagos recibidos:', data);

      if (data.result && data.data && Array.isArray(data.data.data)) {
        setPaymentsTypes(data.data.data);
        setDebugInfo((prev) => ({ ...prev, paymentsTypesLoaded: data.data.data.length }));
        console.log(`✅ ${data.data.data.length} pagos cargados`);
      } else {
        console.warn('⚠️ Respuesta tipos de pagos sin datos válidos');
        setPaymentsTypes([]);
      }
    } catch (error) {
      console.error('❌ Error cargando tipos de pagos:', error);
      showSnackbar(`Error al cargar tipos de pagos: ${error.message}`, 'warning');
      setPaymentsTypes([]);
    }
  };

  // 📥 FUNCIÓN: Cargar clientes
  const loadClients = async () => {
    console.log('🔄 Iniciando carga de clientes...');

    try {
      const headers = getRequestHeaders();
      if (!headers) {
        console.error('❌ No se pudieron obtener headers válidos');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/admin/clients/list', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'no-cache',
      });

      console.log('📡 Status de respuesta clientes:', response.status);

      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log('✅ Respuesta completa del backend:', data);

        if (data.result === true) {
          let clientsArray = null;

          // Manejar estructura anidada
          if (data.data && Array.isArray(data.data)) {
            clientsArray = data.data;
          } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
            if (data.data.result === true) {
              clientsArray = data.data.data;
            } else {
              console.error('❌ Resultado interno es false:', data.data.message);
              showSnackbar(
                `Error interno del servidor: ${data.data.message || 'Sin mensaje'}`,
                'error',
              );
              setClients([]);
              return;
            }
          } else {
            console.error('❌ Estructura de datos no reconocida');
            showSnackbar('Error: Estructura de datos no reconocida del servidor', 'error');
            setClients([]);
            return;
          }

          if (clientsArray && Array.isArray(clientsArray)) {
            setClients(clientsArray);
            setDebugInfo((prev) => ({ ...prev, clientsLoaded: clientsArray.length }));
            console.log('✅ clientes asignadas al estado correctamente');
            showSnackbar(`${clientsArray.length} clientes cargadas correctamente`, 'success');
          } else {
            console.error('❌ No se pudo obtener array válido de clientes');
            setClients([]);
            showSnackbar('Error: No se encontraron datos válidos de clientes', 'error');
          }
        } else {
          console.error('❌ Result principal es false:', data.message);
          setClients([]);
          showSnackbar(`Error del servidor: ${data.message || 'Sin mensaje de error'}`, 'error');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error HTTP en clientes:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });

        if (response.status === 401 || response.status === 403) {
          showSnackbar('Error de autenticación. Token inválido o expirado.', 'error');
          localStorage.removeItem('token');
          setTimeout(() => (window.location.href = '/auth/login'), 2000);
        } else {
          showSnackbar(`Error HTTP ${response.status}: ${errorText}`, 'error');
        }

        setClients([]);
      }
    } catch (error) {
      console.error('❌ Error COMPLETO en loadPersons:', error);

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showSnackbar('Error de red. Verifique la conexión con el backend.', 'error');
      } else if (error.name === 'SyntaxError') {
        showSnackbar('Error de formato en respuesta del servidor.', 'error');
      } else {
        showSnackbar(`Error inesperado: ${error.message}`, 'error');
      }

      setClients([]);
    }
  };

  const esNumeroValido = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar cliente
    if (!formData.inv_client_id) {
      newErrors.inv_client_id = 'Debe seleccionar un cliente';
    }

    // Validar paciente
    if (!formData.inv_patient_id) {
      newErrors.inv_patient_id = 'Debe seleccionar un paciente';
    }

    // Validar id en modo edición
    if (dialogMode === 'edit' && !formData.inv_id) {
      newErrors.inv_id = 'ID de la factura requerido para la edición';
    }

    // Validar valores numéricos del subtotal, descuento, impuesto y total
    const subtotal = parseFloat(formData.inv_subtotal || 0);
    const discount = parseFloat(formData.inv_discount || 0);
    const tax = parseFloat(formData.inv_tax || 0);
    const total = parseFloat(formData.inv_grand_total || 0);

    if (subtotal <= 0) {
      newErrors.inv_subtotal = 'El subtotal debe ser mayor que 0';
    }

    if (total <= 0) {
      newErrors.inv_grand_total = 'El total debe ser mayor que 0';
    }

    if (discount < 0) {
      newErrors.inv_discount = 'El descuento no puede ser negativo';
    }

    if (discount > subtotal) {
      newErrors.inv_discount = 'El descuento no puede ser mayor que el subtotal';
    }

    const expectedTotal = subtotal - discount + tax;
    if (Math.abs(expectedTotal - total) > 0.01) {
      newErrors.inv_grand_total = 'El total no coincide con subtotal - descuento + impuesto';
    }

    // Validar productos (detalles)
    const detallesMapeados = (formData.details || []).map((item) => ({
      ind_product_id: item.pro_id,
      ind_quantity: item.cantidad,
      ind_unit_price: item.pro_price,
      ind_total: item.total,
    }));

    if (detallesMapeados.length === 0) {
      newErrors.details = 'Debe agregar al menos un producto o servicio';
    } else {
      detallesMapeados.forEach((detalle, i) => {
        if (
          !esNumeroValido(detalle.ind_product_id) ||
          !esNumeroValido(detalle.ind_quantity) ||
          !esNumeroValido(detalle.ind_unit_price) ||
          !esNumeroValido(detalle.ind_total)
        ) {
          newErrors.details = `El producto en la posición ${i + 1} tiene campos inválidos`;
        }
      });
    }

    // Validar impuestos (datosTablaTax)
    if (!Array.isArray(datosTablaTax) || datosTablaTax.length === 0) {
      newErrors.taxes = 'Debe seleccionar al menos un impuesto';
    } else {
      for (let i = 0; i < datosTablaTax.length; i++) {
        const taxItem = datosTablaTax[i];
        if (!esNumeroValido(taxItem.tax_id)) {
          newErrors.taxes = `El impuesto en la posición ${i + 1} tiene campos inválidos`;
          break;
        }
        // Puedes agregar validación para taxItem.monto si lo usas
      }
    }

    // Validar pagos solo en modo creación
    if (dialogMode === 'create') {
      const pagos = formData.payments || [];
      if (pagos.length === 0) {
        newErrors.payments = 'Debe ingresar al menos un pago inicial';
      } else {
        for (let i = 0; i < pagos.length; i++) {
          const p = pagos[i];
          if (
            !esNumeroValido(p.inp_payment_method_id) ||
            !esNumeroValido(p.inp_amount) ||
            Number(p.inp_amount) <= 0 ||
            (p.inp_reference != null && typeof p.inp_reference !== 'string') ||
            (p.inp_proof_image_path != null && typeof p.inp_proof_image_path !== 'string')
          ) {
            newErrors.payments = `El pago en la posición ${i + 1} tiene campos inválidos`;
            break;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FUNCION: Guardar factura
  const saveInvoice = async () => {
    console.log('🔍 Iniciando saveInvoice con modo:', dialogMode);

    const isValid = validateForm();
    if (!isValid) {
      alert('Por favor, corrija los errores en el formulario');
      console.error('❌ Errores de validación:', 'Validación fallida');
      return;
    }

    setLoading(true);
    try {
      const headers = getRequestHeaders();
      if (!headers) return;

      const url =
        dialogMode === 'create'
          ? 'http://127.0.0.1:5000/admin/invoice/add'
          : 'http://127.0.0.1:5000/admin/invoice/update';

      const method = dialogMode === 'create' ? 'POST' : 'PATCH';

      const userProcess = getCurrentUser() || 'admin';

      const subtotal = parseFloat(formData.inv_subtotal || 0);

      // Calcular montos de impuestos justo antes de enviar
      const impuestosConMontos = (datosTablaTax || []).map((tax) => ({
        int_tax_id: tax.tax_id,
        int_tax_amount: parseFloat((subtotal * (tax.tax_percentage / 100)).toFixed(2)),
      }));

      const mappedDetails = (formData.details || []).map((item) => ({
        ind_product_id: item.pro_id,
        ind_quantity: item.cantidad,
        ind_unit_price: item.pro_price,
        ind_total: item.total,
      }));

      const mappedPayments = (formData.payments || []).map((p) => ({
        inp_payment_method_id: p.inp_payment_method_id,
        inp_amount: p.inp_amount,
        inp_reference: p.inp_reference,
        inp_proof_image_path: p.inp_proof_image_path,
      }));

      let requestData;

      if (dialogMode === 'create') {
        requestData = {
          inv_number: (formData.inv_number || '').toString(),
          inv_client_id: parseInt(formData.inv_client_id),
          inv_patient_id: parseInt(formData.inv_patient_id),
          inv_subtotal: subtotal,
          inv_discount: parseFloat(formData.inv_discount || 0),
          inv_tax: impuestosConMontos.reduce((acc, tax) => acc + tax.int_tax_amount, 0),
          //inv_grand_total: parseFloat(formData.inv_grand_total || 0),
          details: mappedDetails,
          taxes: impuestosConMontos,
          payments: mappedPayments,
          user_process: userProcess,
        };
        console.log(requestData);
      } else {
        requestData = {
          inv_id: parseInt(formData.inv_id),
          inv_number: (formData.inv_number || '').toString(),
          inv_subtotal: subtotal,
          inv_discount: parseFloat(formData.inv_discount || 0),
          inv_tax: impuestosConMontos.reduce((acc, tax) => acc + tax.int_tax_amount, 0),
          //inv_grand_total: parseFloat(formData.inv_grand_total || 0),
          details: mappedDetails,
          taxes: impuestosConMontos,
          payments: mappedPayments,
          user_process: userProcess,
        };
      }

      console.log('📤 Enviando factura:', requestData);

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(requestData),
      });

      console.log('📡 Estado de respuesta:', response.status);
      const data = await response.json();
      console.log('📡 Datos recibidos:', data);

      if (response.ok && data.result) {
        showSnackbar(
          dialogMode === 'create'
            ? '✅ Factura creada correctamente'
            : '✅ Factura actualizada correctamente',
          'success',
        );
        resetForm();
        setClientSearch('');
        setPatientSearch('');
        setOpenDialog(false);
        //await loadInvoices();
        await loadInitialData();
      } else {
        const errorMessage = data.message || 'Error desconocido del servidor';
        console.error('❌ Error del servidor:', errorMessage);
        showSnackbar(`❌ Error al guardar la factura: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('❌ Error en saveInvoice:', error);
      showSnackbar(`❌ Error de conexión: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ FUNCIÓN: Abrir confirmación de eliminación
  const openDeleteConfirmation = (inv) => {
    setDeleteDialog({
      open: true,
      invoice: inv,
      loading: false,
    });
  };

  // 🗑️ FUNCIÓN: Eliminar factura
  const confirmDeleteInvoice = async () => {
    if (!deleteDialog.invoice) return;

    const id = deleteDialog.invoice.inv_id;

    const user = getCurrentUser();
    if (!user) {
      showSnackbar('⚠️ Usuario no autenticado.', 'error');
      return;
    }

    console.log('🗑️ Iniciando eliminación de la factura:', id, 'por usuario:', user);

    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const headers = getRequestHeaders();
      if (!headers) {
        showSnackbar('❌ No se pudieron obtener los headers de autenticación.', 'error');
        setDeleteDialog((prev) => ({ ...prev, loading: false }));
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/admin/invoice/delete/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      console.log('📡 Delete response status:', response.status);

      const data = await response.json();
      console.log('📡 Delete response data:', data);

      if (response.ok && data.result) {
        showSnackbar('✅ factura eliminada correctamente', 'success');
        setDeleteDialog({ open: false, invoice: null, loading: false });
        await loadInvoices(); // Recargar lista después de eliminar
      } else {
        const errorMessage = data.message || 'Error desconocido del servidor';
        console.error('❌ Error al eliminar factura:', errorMessage);
        showSnackbar(`❌ Error al eliminar factura: ${errorMessage}`, 'error');
        setDeleteDialog((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('❌ Error completo en deleteUser:', error);
      showSnackbar(`❌ Error de conexión al eliminar: ${error.message}`, 'error');
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // 🗑️ Cancelar eliminación
  const cancelDelete = () => {
    setDeleteDialog({ open: false, invoice: null, loading: false });
  };

  // 🔄 Funciones de manejo de diálogos
  const openCreateDialog = () => {
    setDialogMode('create');
    resetForm();
    setErrors({});
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      inv_id: '',
      inv_client_id: '',
      inv_patient_id: '',
      inv_subtotal: 0,
      inv_discount: 0,
      inv_tax: 0,
      inv_grand_total: 0,
      details: [],
      payments: [],
      taxes: [],
    });
    setCantidadSeleccionada('');
    setDatosTablaPrd([]);
    setDatosTablaTax([]);
    setDatosTablaPagos([]);
    setInvoice(null);
    setErrors({});
  };

  // 📨 Función para mostrar mensajes
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔍 Filtrar usuarios según término de búsqueda
  const filteredInvoice = invoices.filter((inv) =>
    inv.inv_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 🎨 Función para obtener color del chip según estado
  const getStatusChip = (isActive = true) => {
    return (
      <Chip
        sx={{
          bgcolor: isActive
            ? (theme) => theme.palette.success.light
            : (theme) => theme.palette.error.light,
          color: isActive
            ? (theme) => theme.palette.success.main
            : (theme) => theme.palette.error.main,
          borderRadius: '8px',
        }}
        size="small"
        label={isActive ? 'Activo' : 'Inactivo'}
      />
    );
  };

  // 🔍 Función para verificar si el formulario es válido
  const isFormValid = () => {
    const hasClientAndPatient = formData.inv_client_id && formData.inv_patient_id;
    const hasTotals =
      parseFloat(formData.inv_subtotal) > 0 &&
      parseFloat(formData.inv_grand_total) > 0 &&
      parseFloat(formData.inv_discount) <= parseFloat(formData.inv_subtotal);

    const hasProducts = Array.isArray(datosTablaPrd) && datosTablaPrd.length > 0;
    const hasTaxes = Array.isArray(datosTablaTax) && datosTablaTax.length > 0;
    //const hasPayments = Array.isArray(datosTablaPagos) && datosTablaPagos.length > 0;

    const hasInvoiceIdIfEdit = dialogMode !== 'edit' || formData.inv_id;

    return (
      hasClientAndPatient &&
      hasTotals &&
      hasProducts &&
      hasTaxes &&
      //hasPayments &&
      hasInvoiceIdIfEdit
    );
  };

  const getClientFullName = (clientId) => {
    const person = clients.find((p) => p.cli_id === clientId);
    return person ? `${person.cli_name} ${person.cli_identification}` : 'Sin datos de persona';
  };

  const getPacientFullName = (patientId) => {
    const paciente = patients.find((p) => p.pat_id === patientId);
    return paciente ? getPersonFullName(paciente.pat_person_id) : 'Sin datos de paciente';
  };

  const getPersonFullName = (id) => {
    const person = personas.find((p) => p.per_id === id);
    return person ? `${person.per_names} ${person.per_surnames}` : 'Sin datos de persona';
  };

  //funciona
  const agregarProducto = () => {
    const { pro_id, pro_price } = productoSeleccionado;

    // Validación de cantidad
    const cantidad = parseInt(cantidadSeleccionada);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('Ingrese una cantidad válida mayor a cero.');
      return;
    }

    // Validación de producto
    if (!pro_id || !pro_price) {
      alert('Debe seleccionar un producto válido.');
      return;
    }

    //requiere en mi InvoiceDetail: ind_invoice_id, ind_product_id, ind_quantity, ind_unit_price, ind_total
    const nuevoProducto = {
      pro_id: productoSeleccionado.pro_id,
      pro_name: productoSeleccionado.pro_name,
      pro_price: productoSeleccionado.pro_price,
      pro_total_sessions: productoSeleccionado.pro_total_sessions,
      cantidad: cantidad,
      total: productoSeleccionado.pro_price * cantidad,
    };

    const prd = {
      ind_product_id: productoSeleccionado.pro_id,
      ind_quantity: cantidad,
      ind_unit_price: productoSeleccionado.pro_price,
      ind_total: productoSeleccionado.pro_price * cantidad,
    };

    setDatosTablaPrd((prevDatos) => [...prevDatos, nuevoProducto]);
    // Agrega el prodiucto al array principal de formData
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, prd],
    }));

    // Limpiar estados
    setBanderaModalProductos(false);
    setCantidadSeleccionada('');
    setProductoSeleccionado({ pro_id: '', pro_name: '', pro_price: '', pro_total_sessions: '' });
  };

  //funciona
  const agregarImpuesto = () => {
    const { tax_id, tax_percentage } = taxSeleccionado;

    // Validación de producto
    if (!tax_id || !tax_percentage) {
      alert('Debe seleccionar un impuesto válido.');
      return;
    }

    // Validar si el impuesto ya fue agregado
    const existe = datosTablaTax.some((element) => element.tax_id === tax_id);
    if (existe) {
      alert('No se puede repetir el impuesto');
      return;
    }

    const nuevoTax = {
      tax_id: taxSeleccionado.tax_id,
      tax_name: taxSeleccionado.tax_name,
      tax_percentage: taxSeleccionado.tax_percentage,
      tax_description: taxSeleccionado.tax_description,
      //monto se calcula en el api
    };

    setDatosTablaTax((prevDatos) => [...prevDatos, nuevoTax]);
    // Agrega impuesto al array principal de formData
    setFormData((prev) => ({
      ...prev,
      taxes: [...prev.taxes, nuevoTax],
    }));
    // Limpiar estados
    setBanderaModalImpuestos(false);
    setTaxSeleccionado({ tax_id: '', tax_name: '', tax_percentage: '', tax_description: '' });
  };

  //funciona
  const agregarPago = () => {
    const { inp_payment_method_id, inp_amount, inp_reference, inp_proof_image_path } = formDataPago;

    // Validación base (ya existente)
    if (!inp_payment_method_id || isNaN(parseFloat(inp_amount)) || parseFloat(inp_amount) <= 0) {
      alert('Debe seleccionar un método de pago y un monto válido mayor a 0.');
      return;
    }

    // Validación: Comprobante (foto) obligatorio
    if (!inp_proof_image_path && inp_payment_method_id === 3) {
      alert('Debe subir un comprobante de pago (imagen) para el tipo de pago T/C');
      return;
    }

    if (inp_payment_method_id !== 1 && !inp_reference) {
      alert('Debe ingresar una referencia de pago.');
      return;
    }

    // ✅ NUEVA validación: Evitar que la suma de pagos supere el total
    const nuevoMonto = parseFloat(inp_amount);
    const totalFactura = parseFloat(formData.inv_grand_total || 0);
    const sumaPagosActuales = formData.payments.reduce(
      (acum, pago) => acum + parseFloat(pago.inp_amount || 0),
      0,
    );

    const sumaFinal = sumaPagosActuales + nuevoMonto;

    if (sumaFinal > totalFactura) {
      alert(
        `El total de pagos (${sumaFinal.toFixed(
          2,
        )}) supera el total de la factura (${totalFactura.toFixed(2)}).`,
      );
      return;
    }

    const nuevoPago = {
      inp_payment_method_id: parseInt(inp_payment_method_id),
      inp_amount: parseFloat(inp_amount),
      inp_reference: inp_reference || '',
      inp_proof_image_path: inp_proof_image_path || '',
    };

    setFormData((prev) => ({
      ...prev,
      payments: [...prev.payments, nuevoPago],
    }));

    setFormDataPago({
      inp_payment_method_id: '',
      inp_amount: '',
      inp_reference: '',
      inp_proof_image_path: '',
    });

    setBanderaModalPagos(false);
  };

  const seleccionarProducto = (prdSeleccionado) => {
    setProductoSeleccionado(prdSeleccionado);
  };

  const seleccionarImpuesto = (tax) => {
    setTaxSeleccionado(tax);
  };

  const quitarProducto = (index) => {
    const nuevosProductos = [...datosTablaPrd];
    nuevosProductos.splice(index, 1);
    setDatosTablaPrd(nuevosProductos);
  };

  const quitarTax = (index) => {
    const nuevosImpuestos = [...datosTablaTax];
    nuevosImpuestos.splice(index, 1);
    setDatosTablaTax(nuevosImpuestos);
  };

  const quitarPago = (index) => {
    setFormData((prev) => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index),
    }));
  };

  const cerrarModalProductos = () => {
    setBanderaModalProductos(false);
    setProductoSeleccionado({ pro_id: '', pro_name: '', pro_price: '', pro_total_sessions: '' });
    setCantidadSeleccionada('');
  };

  const cerrarModalImpuestos = () => {
    setBanderaModalImpuestos(false);
    setTaxSeleccionado({
      tax_id: '',
      tax_name: '',
      tax_percentage: '',
      tax_description: '',
    });
  };

  const cerrarModalPagos = () => {
    setBanderaModalPagos(false);
    setFormDataPago({
      inp_payment_method_id: '',
      inp_amount: '',
      inp_reference: '',
      inp_proof_image_path: '',
    });
    setErrors({});
  };

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(valor);

  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.warn('⚠️ No se seleccionó ningún archivo');
      return;
    }

    console.log('📤 Subiendo imagen del comprobante:', file.name);
    setLoading(true);

    try {
      const headers = getRequestHeaders();
      if (!headers) {
        console.error('❌ No hay token disponible');
        showSnackbar('❌ No hay token disponible', 'error');
        return;
      }

      // ⚠️ Quitar Content-Type porque fetch con FormData lo maneja automáticamente
      const { tokenapp } = headers;
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/admin/invoice/upload-proof', {
        method: 'POST',
        headers: {
          tokenapp: tokenapp, // Solo pasamos el token, sin Content-Type
        },
        body: formData,
      });

      console.log('📡 Estado de respuesta (imagen):', response.status);
      const data = await response.json();
      console.log('📡 Datos recibidos (imagen):', data);

      if (response.ok && data.result) {
        const rutaImagen = data.data?.ruta;
        console.log('📍 Ruta guardada en backend:', rutaImagen);

        setFormDataPago((prev) => ({
          ...prev,
          inp_proof_image_path: rutaImagen,
        }));

        showSnackbar('✅ Imagen subida correctamente', 'success');
      } else {
        const errorMessage = data.message || 'Error al subir imagen';
        console.error('❌ Error al subir imagen:', errorMessage);
        showSnackbar(`❌ ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('❌ Error de conexión al subir imagen:', error);
      showSnackbar(`❌ Error de conexión: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalPagado = (idFactura) => {
    const pagosInv = payments.filter((p) => p.inp_invoice_id == idFactura);
    if (pagosInv.length === 0) {
      return 'Sin pagos con ese id de factura';
    }

    let total = 0;
    pagosInv.forEach((element) => {
      total += element.inp_amount;
    });

    return total;
  };

  const calcularRestanteAPagar = (idFactura, total) => {
    const pagosInv = payments.filter((p) => p.inp_invoice_id == idFactura);
    if (pagosInv.length === 0) {
      return 'Sin pagos con ese id de factura';
    }

    let monto = 0;
    pagosInv.forEach((element) => {
      monto += element.inp_amount;
    });

    return total - monto;
  };

  const comparacion = (total, pagado) => {
    if (pagado < total) {
      return 'Parcialmente pagado';
    } else {
      return 'Totalmente pagado';
    }
  };

  // Buscar persona por cédula y autocompletar
  const handleClientSearch = async () => {
    setCLientSearchLoading(true);
    try {
      const clientFound = clients.find((c) => c.cli_identification === clientSearch.trim());
      if (clientFound) {
        setFormData((prev) => ({
          ...prev,
          inv_client_id: clientFound.cli_id,
        }));
        setErrors((prev) => ({ ...prev, inv_client_id: '' }));
        showSnackbar('Cliente encontrado', 'success');
      } else {
        showSnackbar('No se encontró el cliente con esa cédula', 'warning');
      }
    } catch {
      showSnackbar('Error al buscar cliente', 'error');
    }
    setCLientSearchLoading(false);
  };

  const handlePatientSearch = async () => {
    setPatientSearchLoading(true);
    try {
      const person = personas.find((p) => p.per_identification === patientSearch.trim());
      const patientFound = patients.find((pat) => pat.pat_person_id === person.per_id);
      if (patientFound) {
        setFormData((prev) => ({
          ...prev,
          inv_patient_id: patientFound.pat_id,
        }));
        setErrors((prev) => ({ ...prev, inv_patient_id: '' }));
        showSnackbar('Paciente encontrado', 'success');
      } else {
        showSnackbar('No se encontró el paciente con esa cédula', 'warning');
      }
    } catch {
      showSnackbar('Error al buscar paciente', 'error');
    }
    setPatientSearchLoading(false);
  };

  const setearNumFactura = () => {
    if (invoices.length === 0) {
      setFormData((prev) => ({ ...prev, inv_number: 1 }));
    } else {
      // Encuentra el mayor inv_number (por si no es lo mismo que inv_id)
      const maxNumber = Math.max(...invoices.map((inv) => Number(inv.inv_number || 0)));
      setFormData((prev) => ({ ...prev, inv_number: maxNumber + 1 }));
    }
  };

  return (
    <PageContainer
      title="Gestión de facturas"
      description="Administración de facturas del sistema CERAGEN"
    >
      {/* 🍞 Breadcrumb */}
      <Breadcrumb title="Gestión de Facturas" items={BCrumb} />

      {/* 🎯 Card Principal */}
      <Paper sx={{ p: 3 }}>
        {/* 🚨 Panel de Debug - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              🔍 Información de Debug
            </Typography>
            <Typography variant="body2">
              • Token existe: {debugInfo.tokenExists ? '✅ Sí' : '❌ No'}
              <br />• Longitud token: {debugInfo.tokenLength} caracteres
              <br />• Facturas cargadas: {debugInfo.invoicesLoaded}
              <br />• Pacientes cargados: {debugInfo.patientsLoaded}
              <br />• Clientes cargados: {debugInfo.clientsLoaded}
              <br />• Productos cargados: {debugInfo.productsLoaded}
              <br />• Impuestos cargados: {debugInfo.taxesLoaded}
              <br />• Pagos cargados: {debugInfo.paymentsTypesLoaded}
              <br />• Última carga: {debugInfo.lastLoad || 'Nunca'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button size="small" onClick={loadInitialData} startIcon={<IconRefresh />}>
                Recargar Todo
              </Button>
              <Button size="small" onClick={loadInvoices} sx={{ ml: 1 }} startIcon={<IconUsers />}>
                Solo facturas
              </Button>
            </Box>
          </Alert>
        )}

        {/* 🎯 Header con acciones */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography
                variant="h4"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <IconUsers size={28} />
                Gestión de Facturas
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Administra las facturas del sistema de Centro Médico CERAGEN
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Tooltip title="Actualizar datos">
                <IconButton onClick={loadInitialData} disabled={loading} color="primary">
                  <IconRefresh />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={() => {
                  openCreateDialog();
                  setearNumFactura();
                }}
                disabled={loading || clients.length === 0 || patients.length === 0}
              >
                Nueva Factura
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* 🚨 Alert si no hay clientes */}
        {clients.length === 0 && !loading && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadClients}
                startIcon={<IconRefresh />}
              >
                Reintentar
              </Button>
            }
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              ⚠️ No se pudieron cargar los clientes
            </Typography>
            <Typography variant="body2">
              Sin clientes registrados no es posible crear facturas. Verifique que el backend esté
              ejecutándose y que el token sea válido.
            </Typography>
          </Alert>
        )}

        {/* 📊 Indicador de carga global */}
        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Cargando datos del sistema...
            </Typography>
          </Box>
        )}

        {/* 🔍 Barra de búsqueda */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por código de la factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />,
            }}
            variant="outlined"
          />
        </Box>

        {/* 📊 Tabla de facturas */}
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="tabla de facturas" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Información de la factura</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Datos del cliente/beneficiario </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Resumen de pago</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Estado del pago</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Estado de la factura</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">Acciones</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Cargando las facturas...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredInvoice.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        {searchTerm
                          ? 'No se encontró una factura que coincida con la búsqueda'
                          : 'No hay facturas registradas'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoice.map((inv) => (
                    <TableRow key={inv.inv_id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: (theme) => theme.palette.primary.main,
                              width: 35,
                              height: 35,
                            }}
                          >
                            {inv.inv_id}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              {inv.inv_number}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              Fecha de realización: {formatoFecha(inv.inv_date)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              Cliente: {getClientFullName(inv.inv_client_id)}
                            </Typography>
                            <Typography color="h6" variant="caption">
                              Paciente: {getPacientFullName(inv.inv_patient_id)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box display="flex" flexDirection="column">
                            <Typography variant="h6" fontWeight="600">
                              Subtotal: {formatoMoneda(inv.inv_subtotal)}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              Descuento: {formatoMoneda(inv.inv_discount)}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              Impuestos: {formatoMoneda(inv.inv_tax)}
                            </Typography>
                            <Typography color="h6" fontWeight="600">
                              Total: {formatoMoneda(inv.inv_grand_total)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box display="flex" flexDirection="column">
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color={
                                comparacion(
                                  inv.inv_grand_total,
                                  calcularTotalPagado(inv.inv_id),
                                ) === 'Totalmente pagado'
                                  ? 'success.main'
                                  : 'warning.main'
                              }
                            >
                              {comparacion(inv.inv_grand_total, calcularTotalPagado(inv.inv_id))}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              Dinero abonado: {formatoMoneda(calcularTotalPagado(inv.inv_id))}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              Dinero restante por pagar:{' '}
                              {formatoMoneda(
                                calcularRestanteAPagar(inv.inv_id, inv.inv_grand_total),
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Estado */}
                      <TableCell>{getStatusChip(Boolean(inv.inv_state))}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {' '}
                          <Tooltip title="Agregar pago a factura">
                            <IconButton
                              size="small"
                              //onClick={() => openEditDialog(inv)}
                              onClick={() => navigate(`/admin/invoice/edit/${inv.inv_id}`)}
                              color="info"
                            >
                              <IconCash />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Ver detalles de factura">
                            <IconButton
                              size="small"
                              //onClick={() => openViewDialog(inv)}
                              onClick={() => navigate(`/admin/invoice/${inv.inv_id}`)}
                              color="info"
                            >
                              <IconEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar factura">
                            <IconButton
                              size="small"
                              onClick={() => openDeleteConfirmation(inv)}
                              color="error"
                              disabled={loading}
                            >
                              <IconTrash />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* 📊 Estadísticas rápidas */}
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {invoices.filter((u) => u.inv_state !== false).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Facturas Activas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {patients.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pacientes disponibles
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="secondary.main">
                  {clients.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Clientes disponibles
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* 📝 Diálogo para crear factura */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            {dialogMode === 'create' ? (
              <IconPlus />
            ) : dialogMode === 'edit' ? (
              <IconEdit />
            ) : (
              <IconEye />
            )}
            <Typography variant="h6">
              {dialogMode === 'create'
                ? 'Crear Nueva Factura'
                : dialogMode === 'edit'
                ? 'Editar Factura'
                : 'Ver Factura'}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {/* 🚨 Alert si no hay clientes en el diálogo */}
          {clients.length === 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconAlertTriangle size={20} />
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    No hay clientes disponibles
                  </Typography>
                  <Typography variant="caption">
                    No es posible crear facturas sin clientes registrados. Contacte al administrador
                    del sistema.
                  </Typography>
                </Box>
              </Stack>
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* ✅ CAMPO: ID (solo en view) */}
            {dialogMode === 'view' && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="inv_id">ID:</CustomFormLabel>
                <CustomTextField
                  disabled
                  id="inv_id"
                  fullWidth
                  value={formData.inv_id}
                  variant="outlined"
                  error={!!errors.inv_id}
                  helperText={errors.inv_id || 'Este Id único para esta factura'}
                />
              </Grid>
            )}

            {/* ✅ CAMPO: Numero de factura*/}
            {/* ✅ CAMPO: Número de factura */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inv_number">Número de factura *</CustomFormLabel>
              <CustomTextField
                id="inv_number"
                disabled
                type="number"
                value={formData.inv_number}
                fullWidth
                placeholder="Generado automáticamente"
                variant="outlined"
                error={!!errors.inv_number}
                helperText={errors.inv_number || 'Este número se genera automáticamente'}
              />
            </Grid>

            {/* ✅ CAMPO: Selección de Cliente */}
            <Grid item xs={12}>
              <Box
                component="fieldset"
                sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2 }}
              >
                <Typography component="legend" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Selección de Cliente
                </Typography>

                <Typography>Puede elegir entre buscar o seleccionar de la lista</Typography>

                <Grid container spacing={2} alignItems="center">
                  {/* Buscar por cédula + botón */}
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="client_search">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconId size={16} />
                        <span>Buscar Cliente por Cédula</span>
                      </Stack>
                    </CustomFormLabel>

                    <Stack direction="row" spacing={1}>
                      <CustomTextField
                        id="client_search"
                        fullWidth
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Ingrese cédula y presione Buscar"
                        error={!!errors.inv_client_id}
                        helperText={errors.inv_client_id || ''}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleClientSearch}
                        disabled={!clientSearch || clientSearchLoading}
                        startIcon={
                          clientSearchLoading ? <CircularProgress size={16} /> : <IconSearch />
                        }
                      >
                        Buscar
                      </Button>
                    </Stack>
                  </Grid>

                  {/* Select de cliente */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.inv_client_id}>
                      <InputLabel>Cliente*</InputLabel>
                      <Select
                        value={formData.inv_client_id}
                        onChange={(e) => {
                          setFormData({ ...formData, inv_client_id: e.target.value });
                          if (errors.inv_client_id) {
                            setErrors({ ...errors, inv_client_id: '' });
                          }
                        }}
                        disabled={dialogMode === 'view' || clients.length === 0}
                        label="Cliente"
                      >
                        <MenuItem value="">
                          <em>
                            {clients.length === 0
                              ? 'No hay clientes disponibles'
                              : `Seleccionar cliente (${clients.length} disponibles)`}
                          </em>
                        </MenuItem>
                        {clients.map((clt) => (
                          <MenuItem key={clt.cli_id} value={clt.cli_id}>
                            <Typography variant="body2">
                              {clt.cli_id} - {clt.cli_name} - {clt.cli_identification}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.inv_client_id && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.inv_client_id}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Información del cliente encontrado */}
                  {formData.inv_client_id && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Cliente seleccionado:{' '}
                        {clients.find((c) => c.cli_id === formData.inv_client_id)?.cli_name} -{' '}
                        {
                          clients.find((c) => c.cli_id === formData.inv_client_id)
                            ?.cli_identification
                        }
                      </Typography>
                    </Grid>
                  )}

                  {/* Campo oculto para ID del cliente */}
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="inv_client_id">ID del cliente *</CustomFormLabel>
                    <CustomTextField
                      id="inv_client_id"
                      disabled
                      type="number"
                      value={formData.inv_client_id}
                      fullWidth
                      variant="outlined"
                      error={!!errors.inv_client_id}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* ✅ CAMPO: Selección de paciente */}
            <Grid item xs={12}>
              <Box
                component="fieldset"
                sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2 }}
              >
                <Typography component="legend" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Selección de Paciente
                </Typography>

                <Typography>Puede elegir entre buscar o seleccionar de la lista</Typography>

                <Grid container spacing={2} alignItems="center">
                  {/* Buscar por cédula + botón */}
                  <Grid item xs={12} md={6}>
                    <CustomFormLabel htmlFor="patient_search">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconId size={16} />
                        <span>Buscar Paciente por Cédula</span>
                      </Stack>
                    </CustomFormLabel>

                    <Stack direction="row" spacing={1}>
                      <CustomTextField
                        id="patient_search"
                        fullWidth
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="Ingrese cédula y presione Buscar"
                        error={!!errors.inv_patient_id}
                        helperText={errors.inv_patient_id || ''}
                      />
                      <Button
                        variant="outlined"
                        onClick={handlePatientSearch}
                        disabled={!patientSearch || patientSearchLoading}
                        startIcon={
                          patientSearchLoading ? <CircularProgress size={16} /> : <IconSearch />
                        }
                      >
                        Buscar
                      </Button>
                    </Stack>
                  </Grid>

                  {/* Select de paciente */}
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.inv_patient_id}
                      sx={{ pt: '8px' }} // para alinear verticalmente
                    >
                      <InputLabel>Paciente *</InputLabel>
                      <Select
                        value={formData.inv_patient_id}
                        onChange={(e) => {
                          const selectedPatient = patients.find((p) => p.pat_id === e.target.value);
                          console.log('🔍 Paciente seleccionada:', selectedPatient);
                          setFormData({ ...formData, inv_patient_id: e.target.value });
                          if (errors.inv_patient_id) {
                            setErrors({ ...errors, inv_patient_id: '' });
                          }
                        }}
                        disabled={dialogMode === 'view' || patients.length === 0}
                        label="Paciente"
                      >
                        <MenuItem value="">
                          <em>
                            {patients.length === 0
                              ? 'No hay pacientes disponibles'
                              : `Seleccionar paciente (${patients.length} disponibles)`}
                          </em>
                        </MenuItem>
                        {patients.map((pat) => (
                          <MenuItem key={pat.pat_id} value={pat.pat_id}>
                            <Typography variant="body2" fontWeight="600">
                              {pat.pat_person_id} - {getPacientFullName(pat.pat_id)}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.inv_patient_id && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.inv_patient_id}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Información del paciente encontrado */}
                  {formData.inv_patient_id && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Paciente seleccionado: {getPacientFullName(formData.inv_patient_id)}
                      </Typography>
                    </Grid>
                  )}

                  {/* Campo oculto para ID del paciente */}
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="inv_patient_id">ID del paciente *</CustomFormLabel>
                    <CustomTextField
                      id="inv_patient_id"
                      disabled
                      type="number"
                      value={formData.inv_patient_id}
                      fullWidth
                      variant="outlined"
                      error={!!errors.inv_patient_id}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* ✅ CAMPO: Tabla de Detalles */}
            <Grid item xs={12}>
              <Paper variant="outlined">
                <TableContainer>
                  <Table aria-label="tabla de detalles de factura" sx={{ whiteSpace: 'nowrap' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Producto</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Cantidad</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Precio Unitario</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Cantidad de sesiones</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Subtotal</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datosTablaPrd.map((prod, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h6" fontWeight="600">
                                {prod?.pro_id || 'ID no encontrado'}
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {prod?.pro_name || 'Producto no encontrado'}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{prod.cantidad}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              ${Number(prod?.pro_price).toFixed(2)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {Number(prod?.pro_total_sessions).toFixed(0)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              ${Number(prod?.total).toFixed(2)}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Quitar">
                                <IconButton
                                  size="small"
                                  onClick={() => quitarProducto(index)}
                                  color="error"
                                  disabled={loading}
                                >
                                  <IconTrash />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={() => {
                  setProductoSeleccionado({
                    id: '',
                    nombre: '',
                    precio: '',
                    cantidad: '',
                    sesiones: '',
                    total: '',
                  });
                  setCantidadSeleccionada('');
                  setBanderaModalProductos(true);
                }}
              >
                Agregar Producto
              </Button>
            </Grid>

            {/* ✅ CAMPO: Tabla de Impuestos */}
            <Grid item xs={12}>
              <Paper variant="outlined">
                <TableContainer>
                  <Table aria-label="tabla de impuestos" sx={{ whiteSpace: 'nowrap' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Impuesto</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Porcentaje</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Descripcion</Typography>
                        </TableCell>

                        {/* <                        <TableCell>
                          <Typography variant="h6">Monto</Typography>
                        </TableCell> */}

                        <TableCell align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datosTablaTax.map((tax, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h6" fontWeight="600">
                                {tax?.tax_id || 'ID no encontrado'}
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {tax?.tax_name || 'Producto no encontrado'}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              ${Number(tax?.tax_percentage).toFixed(2)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{tax?.tax_description}</Typography>
                          </TableCell>

                          {/*                           <TableCell>
                            <Typography variant="body2">
                              ${Number(tax?.monto).toFixed(2)}
                            </Typography>
                          </TableCell> */}

                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Quitar">
                                <IconButton
                                  size="small"
                                  onClick={() => quitarTax(index)}
                                  color="error"
                                  disabled={loading}
                                >
                                  <IconTrash />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={() => {
                  setTaxSeleccionado({
                    tax_id: '',
                    tax_name: '',
                    tax_percentage: '',
                    tax_description: '',
                  });
                  setBanderaModalImpuestos(true);
                }}
              >
                Agregar Impuesto
              </Button>
            </Grid>

            {/* ✅ CAMPO: Tabla de Pagos */}
            <Grid item xs={12}>
              <Paper variant="outlined">
                <TableContainer>
                  <Table aria-label="tabla de pagos" sx={{ whiteSpace: 'nowrap' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Id del método de pago</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Monto</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Referencia</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Ruta del Comprobante</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.payments.map((pay, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h6" fontWeight="600">
                                {pay?.inp_payment_method_id || 'ID no encontrado'}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              ${Number(pay?.inp_amount).toFixed(2)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{pay?.inp_reference}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{pay?.inp_proof_image_path}</Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Quitar">
                                <IconButton
                                  size="small"
                                  onClick={() => quitarPago(index)}
                                  color="error"
                                  disabled={loading}
                                >
                                  <IconTrash />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={() => {
                  /*
                  setTaxSeleccionado({
                    tax_id: '',
                    tax_name: '',
                    tax_percentage: '',
                    tax_description: '',
                  });
                  */
                  setBanderaModalPagos(true);
                }}
              >
                Agregar Pago
              </Button>
            </Grid>

            {/*             <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                * El total de impuestos se calculará automáticamente en la API debido a limitaciones
                técnicas. Asegúrese de que los impuestos escogidos sean correctos.
              </Typography>
            </Grid> */}

            {/* ✅ CAMPO: Subtotal inv_subtotal*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inv_subtotal">Subtotal *</CustomFormLabel>
              <CustomTextField
                id="inv_subtotal"
                disabled
                type="number"
                value={formData.inv_subtotal}
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, inv_subtotal: e.target.value });
                  // Limpiar error si existía
                  if (errors.inv_subtotal) {
                    setErrors({ ...errors, inv_subtotal: '' });
                  }
                }}
                placeholder="Este campo es automático"
                variant="outlined"
                error={!!errors.inv_subtotal}
                helperText={
                  errors.inv_subtotal || 'Se usa para el total de la factura sin impuestos'
                }
              />
            </Grid>

            {/* ✅ CAMPO: Descuento inv_discount*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inv_discount">Descuento *</CustomFormLabel>
              <CustomTextField
                id="inv_discount"
                disabled={dialogMode === 'view'}
                fullWidth
                value={formData.inv_discount}
                onChange={(e) => {
                  const valorDescuento = parseFloat(e.target.value);

                  // Evita valores negativos
                  if (valorDescuento < 0) {
                    setErrors({
                      ...errors,
                      inv_discount: 'El descuento no puede ser negativo',
                    });
                    return;
                  }

                  const subtotal = parseFloat(formData.inv_subtotal) || 0;

                  if (valorDescuento > subtotal) {
                    setErrors({
                      ...errors,
                      inv_discount: 'El descuento no puede ser mayor que el subtotal',
                    });
                  } else {
                    // Limpiar error si es válido
                    if (errors.inv_discount) {
                      setErrors({ ...errors, inv_discount: '' });
                    }
                    setFormData({ ...formData, inv_discount: e.target.value });
                  }
                }}
                placeholder="LLene este campo con la cantidad de $ de descuento de la factura"
                variant="outlined"
                error={!!errors.inv_discount}
                helperText={
                  errors.inv_discount || 'Se usa para verificar el descuento de la factura'
                }
              />
            </Grid>

            {/* ✅ CAMPO: Subtotal inv_tax*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inv_tax">Total de impuestos aplicados *</CustomFormLabel>
              <CustomTextField
                id="inv_tax"
                disabled
                type="number"
                value={formData.inv_tax}
                fullWidth
                onChange={(e) => {
                  setFormData({ ...formData, inv_tax: e.target.value });
                  // Limpiar error si existía
                  if (errors.inv_tax) {
                    setErrors({ ...errors, inv_tax: '' });
                  }
                }}
                placeholder="Este campo se llena automáticamente con los impuestos"
                variant="outlined"
                error={!!errors.inv_tax}
                helperText={
                  errors.inv_tax || 'Se usa para verificar el total de impuestos de la factura'
                }
              />
            </Grid>

            {/* ✅ CAMPO: Descuento inv_grand_total*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inv_grand_total">Total *</CustomFormLabel>
              <CustomTextField
                id="inv_grand_total"
                disabled
                fullWidth
                value={formData.inv_grand_total}
                onChange={(e) => {
                  setFormData({ ...formData, inv_grand_total: e.target.value });
                  // Limpiar error si existía
                  if (errors.inv_grand_total) {
                    setErrors({ ...errors, inv_grand_total: '' });
                  }
                }}
                placeholder="Este campo se llena automaticamente con el total a pagar de la factura"
                variant="outlined"
                error={!!errors.inv_grand_total}
                helperText={
                  errors.inv_grand_total || 'Se usa para verificar el total a pagar de la factura'
                }
              />
            </Grid>
          </Grid>

          {/* 📊 Información adicional en modo edición */}
          {dialogMode === 'edit' && selectedInvoice && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Información de la factura:</strong>
                <br />• ID: {selectedInvoice.inv_id}
                <br />• Cliente ID: {selectedInvoice.inv_client_id}
                <br />• Total: ${selectedInvoice.inv_grand_total?.toFixed(2) || 'No disponible'}
                <br />• Estado de factura:{' '}
                {selectedInvoice.inv_state !== false ? 'Activa' : 'Inactiva'}
                <br />• Estado de pago: {selectedInvoice.estado_pago || 'No calculado'}
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <CustomOutlinedButton
            onClick={() => {
              setOpenDialog(false);
              setClientSearch('');
              setPatientSearch('');
            }}
          >
            {dialogMode === 'view' ? 'Cerrar' : 'Cancelar'}
          </CustomOutlinedButton>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={saveInvoice}
              disabled={loading || !isFormValid() || clients.length === 0}
              startIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : dialogMode === 'create' ? (
                  <IconPlus />
                ) : (
                  <IconCheck />
                )
              }
            >
              {loading
                ? 'Guardando...'
                : dialogMode === 'create'
                ? 'Crear Factura'
                : 'Guardar Cambios'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 🗑️ Modal de seleccion de productos */}
      <Dialog
        open={banderaModalProductos}
        onClose={cerrarModalProductos}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconPlus />
            <Typography variant="h6">Seleccione el producto</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* ✅ Selección de producto */}
            <Grid item xs={12}>
              {/* 📊 Tabla de productos */}
              <Paper variant="outlined">
                <TableContainer>
                  <Table aria-label="tabla de productos" sx={{ whiteSpace: 'nowrap' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Información del producto</Typography>
                          {/* pro_id, pro_name */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Precio </Typography>
                          {/* pro_price */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">N° Sesiones</Typography>
                          {/* pro_total_sessions */}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(products) &&
                        products.map((prd) => (
                          <TableRow key={prd.pro_id}>
                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    width: 35,
                                    height: 35,
                                  }}
                                >
                                  {prd.pro_id}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {prd.pro_name}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {prd.pro_price}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {prd.pro_total_sessions}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell align="center">
                              <Button
                                variant="contained"
                                onClick={() => seleccionarProducto(prd)}
                                startIcon={<IconPlus />}
                                sx={{ mt: 2 }}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* ✅ CAMPO: id de producto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="pro_id">Id de producto *</CustomFormLabel>
              <CustomTextField
                id="pro_id"
                type="number"
                disabled
                value={productoSeleccionado.pro_id}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: nombre de producto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="pro_name">Nombre de producto *</CustomFormLabel>
              <CustomTextField
                id="pro_name"
                type="text"
                disabled
                value={productoSeleccionado.pro_name}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: precio unitario de producto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="pro_price">Precio de producto *</CustomFormLabel>
              <CustomTextField
                id="pro_price"
                type="number"
                disabled
                value={productoSeleccionado.pro_price}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: cantidad de productos*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="ind_quantity">Cantidad de este producto *</CustomFormLabel>
              <CustomTextField
                id="ind_quantity"
                type="number"
                min={1}
                onChange={(e) => setCantidadSeleccionada(parseInt(e.target.value))}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={() => agregarProducto()}
                  startIcon={<IconPlus />}
                  sx={{ mt: 2 }}
                >
                  Agregar Producto
                </Button>
                <Button variant="outlined" color="error" onClick={cerrarModalProductos}>
                  Cancelar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Modal de seleccion de impuestos */}
      <Dialog
        open={banderaModalImpuestos}
        onClose={cerrarModalImpuestos}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconPlus />
            <Typography variant="h6">Seleccione los impuestos aplicables</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* ✅ Selección de impuestos */}
            <Grid item xs={12}>
              {/* 📊 Tabla de impuestos */}
              <Paper variant="outlined">
                <TableContainer>
                  <Table aria-label="tabla de impuestos" sx={{ whiteSpace: 'nowrap' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Información del impuesto</Typography>
                          {/* tax_id, tax_name */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Porcentaje </Typography>
                          {/* tax_percentage */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Descripcion</Typography>
                          {/* tax_description */}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(taxes) &&
                        taxes.map((tax) => (
                          <TableRow key={tax.tax_id}>
                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    width: 35,
                                    height: 35,
                                  }}
                                >
                                  {tax.tax_id}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {tax.tax_name}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {tax.tax_percentage}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {tax.tax_description}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell align="center">
                              <Button
                                variant="contained"
                                onClick={() => seleccionarImpuesto(tax)}
                                startIcon={<IconPlus />}
                                sx={{ mt: 2 }}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* ✅ CAMPO: id de impuesto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tax_id">Id *</CustomFormLabel>
              <CustomTextField
                id="tax_id"
                type="number"
                disabled
                value={taxSeleccionado.tax_id}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: nombre de impuesto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tax_name">Nombre de impuesto *</CustomFormLabel>
              <CustomTextField
                id="tax_name"
                type="text"
                disabled
                value={taxSeleccionado.tax_name}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: porcentaje de impuesto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tax_percentage">Porcentaje *</CustomFormLabel>
              <CustomTextField
                id="tax_percentage"
                type="number"
                disabled
                value={taxSeleccionado.tax_percentage}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* ✅ CAMPO: descripcion de impuesto*/}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tax_description">Descripcion *</CustomFormLabel>
              <CustomTextField
                id="tax_description"
                type="text"
                disabled
                value={taxSeleccionado.tax_description}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={() => agregarImpuesto()}
                  startIcon={<IconPlus />}
                  sx={{ mt: 2 }}
                >
                  Agregar impuesto
                </Button>
                <Button variant="outlined" color="error" onClick={cerrarModalImpuestos}>
                  Cancelar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Modal de agregar un pago */}
      <Dialog
        open={banderaModalPagos}
        onClose={cerrarModalPagos}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconPlus />
            <Typography variant="h6">Ingrese el pago</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Título de sección */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información de Pago
              </Typography>
            </Grid>

            {/* Seleccionar Método de Pago */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inp_payment_method_id">Método de Pago *</CustomFormLabel>
              <FormControl fullWidth error={!!errors.inp_payment_method_id}>
                <Select
                  value={formDataPago.inp_payment_method_id}
                  onChange={(e) =>
                    setFormDataPago({ ...formDataPago, inp_payment_method_id: e.target.value })
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Seleccionar método</em>
                  </MenuItem>
                  {paymentsTypes.map((pay) => (
                    <MenuItem key={pay.pme_id} value={pay.pme_id}>
                      {pay.pme_name} - {pay.pme_description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.inp_payment_method_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.inp_payment_method_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Monto */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="inp_amount">Monto Pagado *</CustomFormLabel>
              <CustomTextField
                id="inp_amount"
                type="number"
                value={formDataPago.inp_amount}
                fullWidth
                onChange={(e) => {
                  setFormDataPago({ ...formDataPago, inp_amount: e.target.value });
                }}
                placeholder="LLene este campo solo con dígitos numéricos"
                variant="outlined"
                helperText={errors.inp_amount || 'Se usa para verificar el monto del pago'}
              />
            </Grid>

            {/* Referencia de transacción */}
            {formDataPago.inp_payment_method_id !== 1 && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="inp_reference">Referencia de Pago *</CustomFormLabel>
                <CustomTextField
                  id="inp_reference"
                  type="text"
                  value={formDataPago.inp_reference}
                  fullWidth
                  onChange={(e) => {
                    setFormDataPago({ ...formDataPago, inp_reference: e.target.value });
                  }}
                  placeholder="LLene este campo con la referencia del pago"
                  variant="outlined"
                  helperText={
                    errors.inp_reference || 'Se usa para verificar la referencia del pago'
                  }
                />
              </Grid>
            )}

            {/* Imagen del comprobante */}
            {formDataPago.inp_payment_method_id === 3 && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="inp_proof_image_path">
                  Comprobante (imagen) *
                </CustomFormLabel>
                <Button variant="outlined" component="label" fullWidth>
                  Subir Comprobante
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>

                {formDataPago.inp_proof_image_path && (
                  <Typography variant="body2" mt={1}>
                    Ruta del comprobante: {formDataPago.inp_proof_image_path}
                  </Typography>
                )}
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={() => agregarPago()}
                  startIcon={<IconPlus />}
                  sx={{ mt: 2 }}
                >
                  Agregar pago
                </Button>
                <Button variant="outlined" color="error" onClick={cerrarModalPagos}>
                  Cancelar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconExclamationMark color="error" />
            <Typography variant="h6" color="error">
              Confirmar Eliminación
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {deleteDialog.invoice && (
              <>
                ¿Está seguro de que desea eliminar esta factura{' '}
                <strong>{deleteDialog.invoice.inv_id}</strong>?
                <br />
                <br />
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>⚠️ Advertencia:</strong>
                    <br />
                    Esta acción marcará la factura como anulada. La factura podrá ser vista
                    únicamente desde la base de datos pero no tendrá ningun valor.
                  </Typography>
                </Alert>
              </>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <CustomOutlinedButton onClick={cancelDelete} disabled={deleteDialog.loading}>
            Cancelar
          </CustomOutlinedButton>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteInvoice}
            disabled={deleteDialog.loading}
            startIcon={deleteDialog.loading ? <CircularProgress size={16} /> : <IconTrash />}
          >
            {deleteDialog.loading ? 'Eliminando...' : 'Eliminar Factura'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 📨 Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default InvoiceManagement;

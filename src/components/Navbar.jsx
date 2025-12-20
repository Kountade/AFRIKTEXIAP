// src/components/Navbar.jsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Icônes Material-UI
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import MovingIcon from '@mui/icons-material/Moving';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TextFieldsIcon from '@mui/icons-material/TextFields'; // Nouvelle icône pour AFRITEXTIA
import LocalMallIcon from '@mui/icons-material/LocalMall'; // Icône boutique
import StorefrontIcon from '@mui/icons-material/Storefront'; // Icône magasin

// Import du logo
import logo from '../assets/logo.svg'; // Assurez-vous que le chemin est correct

import AxiosInstance from './AxiosInstance';

const drawerWidth = 240;

export default function Navbar(props) {
  const { content, mode, toggleColorMode } = props;
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  // State pour le menu utilisateur
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInitial, setUserInitial] = useState('');
  const [stocksFaibles, setStocksFaibles] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [ventesImpayeesCount, setVentesImpayeesCount] = useState(0);
  const [ventesRetardCount, setVentesRetardCount] = useState(0);

  // Récupérer les données utilisateur depuis localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('User');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const user = getUserData();
  const userRole = user?.role || '';
  const userEmail = user?.email || '';
  const userName = user?.username || userEmail.split('@')[0];

  // Générer l'initiale de l'utilisateur
  useEffect(() => {
    if (userName) {
      setUserInitial(userName.charAt(0).toUpperCase());
    }
  }, [userName]);

  // Charger les notifications (stocks faibles et ventes impayées)
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'vendeur') {
      fetchStocksFaibles();
      fetchVentesImpayeesCount();
      fetchVentesRetardCount();
    }
  }, [userRole]);

  const fetchStocksFaibles = async () => {
    try {
      const response = await AxiosInstance.get('/stocks-entrepot/?low_stock=true');
      const stocks = response.data || [];
      setStocksFaibles(stocks);
    } catch (error) {
      console.error('Erreur lors du chargement des stocks faibles:', error);
    }
  };

  const fetchVentesImpayeesCount = async () => {
    try {
      const response = await AxiosInstance.get('/ventes/ventes_impayees/');
      const ventes = response.data || [];
      setVentesImpayeesCount(ventes.length);
    } catch (error) {
      console.error('Erreur lors du chargement des ventes impayées:', error);
    }
  };

  const fetchVentesRetardCount = async () => {
    try {
      const response = await AxiosInstance.get('/ventes/ventes_en_retard/');
      const ventes = response.data || [];
      setVentesRetardCount(ventes.length);
    } catch (error) {
      console.error('Erreur lors du chargement des ventes en retard:', error);
    }
  };

  // Mettre à jour le compteur total de notifications
  useEffect(() => {
    const total = stocksFaibles.length + ventesImpayeesCount + ventesRetardCount;
    setNotificationCount(total);
  }, [stocksFaibles.length, ventesImpayeesCount, ventesRetardCount]);

  console.log('👤 Navbar - User data:', user);
  console.log('🎭 Navbar - User role:', userRole);
  console.log('📧 Navbar - User email:', userEmail);

  const isAdmin = () => userRole === 'admin';
  const isVendeur = () => userRole === 'vendeur';

  // Gestion du menu utilisateur
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = () => {
    navigate('/stocks-entrepot?low_stock=true');
  };

  const handleVentesImpayeesClick = () => {
    navigate('/ventes?statut_paiement=non_paye');
  };

  const handleVentesRetardClick = () => {
    navigate('/ventes?en_retard=true');
  };

  const logoutUser = () => {
    console.log('🚪 Logging out user...');
    handleMenuClose();
    
    AxiosInstance.post(`logoutall/`, {})
      .then(() => {
        console.log('✅ Logout successful');
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        navigate('/');
      })
      .catch((error) => {
        console.error('❌ Logout error:', error);
        // Déconnecter même en cas d'erreur
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        navigate('/');
      });
  };

  const menuItems = [
    // Tableau de bord - Visible pour tous
    {
      id: 1,
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      visible: true,
      roles: ['admin', 'vendeur']
    },
    
    // Point de vente - Admin + Vendeur
    {
      id: 2,
      text: 'Point de Vente',
      icon: <ShoppingCartIcon />,
      path: '/point-de-vente',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur']
    },
    
    // Ventes - Admin + Vendeur
    {
      id: 3,
      text: 'Ventes',
      icon: <PointOfSaleIcon />,
      path: '/ventes',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur'],
      badge: ventesImpayeesCount > 0 || ventesRetardCount > 0
    },
    
    // Clients - Admin + Vendeur
    {
      id: 4,
      text: 'Clients',
      icon: <PeopleIcon />,
      path: '/clients',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur']
    },
    
    // Historique Client - Admin + Vendeur
    {
      id: 5,
      text: 'Historique Client',
      icon: <ReceiptLongIcon />,
      path: '/historique-client',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur']
    },
    
    // Produits - Admin seulement
    {
      id: 6,
      text: 'Produits',
      icon: <InventoryIcon />,
      path: '/produits',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Catégories - Admin seulement
    {
      id: 7,
      text: 'Catégories',
      icon: <CategoryIcon />,
      path: '/categories',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Fournisseurs - Admin seulement
    {
      id: 8,
      text: 'Fournisseurs',
      icon: <BusinessIcon />,
      path: '/fournisseurs',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // ENTREPÔTS - Admin seulement
    {
      id: 9,
      text: 'Entrepôts',
      icon: <WarehouseIcon />,
      path: '/entrepots',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Stocks par entrepôt - Admin + Vendeur
    {
      id: 10,
      text: 'Stocks',
      icon: <InventoryIcon />,
      path: '/stock-entrepot',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur'],
      badge: stocksFaibles.length > 0
    },
    
    // Mouvements de stock - Admin seulement
    {
      id: 11,
      text: 'Mouvements Stock',
      icon: <MovingIcon />,
      path: '/mouvements-stock',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // TRANSFERTS - Admin seulement
    {
      id: 12,
      text: 'Transferts',
      icon: <SwapHorizIcon />,
      path: '/transferts',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Rapports - Admin seulement
    {
      id: 13,
      text: 'Rapports',
      icon: <AssessmentIcon />,
      path: '/rapports',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Rapports Paiements - Admin seulement
    {
      id: 14,
      text: 'Rapports Paiements',
      icon: <PaidIcon />,
      path: '/rapport-paiements',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Statistiques - Admin + Vendeur
    {
      id: 15,
      text: 'Statistiques',
      icon: <TrendingUpIcon />,
      path: '/statistiques',
      visible: isAdmin() || isVendeur(),
      roles: ['admin', 'vendeur']
    },
    
    // Journal d'audit - Admin seulement
    {
      id: 16,
      text: 'Journal Audit',
      icon: <HistoryIcon />,
      path: '/audit',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Utilisateurs - Admin seulement
    {
      id: 17,
      text: 'Utilisateurs',
      icon: <GroupIcon />,
      path: '/utilisateurs',
      visible: isAdmin(),
      roles: ['admin']
    },
    
    // Paramètres - Admin seulement
    {
      id: 18,
      text: 'Paramètres',
      icon: <SettingsIcon />,
      path: '/parametres',
      visible: isAdmin(),
      roles: ['admin']
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
          boxShadow: 1,
          background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)' // Dégradé violet
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Partie gauche avec logo et nom */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo AFRITEXTIA */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              '&:hover': { opacity: 0.9 }
            }}>
              {/* Logo image */}
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={logo} 
                  alt="AFRITEXTIA Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              {/* Nom AFRITEXTIA avec style élégant */}
              <Typography 
                variant="h5" 
                noWrap 
                component="div"
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  fontFamily: "'Montserrat', 'Roboto', sans-serif"
                }}
              >
                AFRITEXTIA
              </Typography>
            </Box>
            
            {/* Badge rôle */}
            <Chip 
              label={userRole === 'admin' ? 'ADMIN' : 'VENDEUR'}
              size="small"
              color={userRole === 'admin' ? 'secondary' : 'success'}
              sx={{ 
                height: 24, 
                fontSize: '0.7rem', 
                fontWeight: 'bold',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            />
          </Box>

          {/* Partie droite avec contrôles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Bouton notifications (stocks faibles) */}
            {(isAdmin() || isVendeur()) && notificationCount > 0 && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    width: 300,
                  },
                }}
              >
                <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Notifications AFRITEXTIA
                </MenuItem>
                <Divider />
                
                {stocksFaibles.length > 0 && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/stocks-entrepot?low_stock=true'); }}>
                    <ListItemIcon>
                      <Badge badgeContent={stocksFaibles.length} color="error">
                        <WarningIcon />
                      </Badge>
                    </ListItemIcon>
                    Stocks faibles
                  </MenuItem>
                )}
                
                {ventesImpayeesCount > 0 && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/ventes?statut_paiement=non_paye'); }}>
                    <ListItemIcon>
                      <Badge badgeContent={ventesImpayeesCount} color="error">
                        <MoneyOffIcon />
                      </Badge>
                    </ListItemIcon>
                    Ventes impayées
                  </MenuItem>
                )}
                
                {ventesRetardCount > 0 && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/ventes?en_retard=true'); }}>
                    <ListItemIcon>
                      <Badge badgeContent={ventesRetardCount} color="error">
                        <AccessTimeIcon />
                      </Badge>
                    </ListItemIcon>
                    Ventes en retard
                  </MenuItem>
                )}
              </Menu>
            )}

            {/* Bouton notifications global */}
            {(isAdmin() || isVendeur()) && notificationCount > 0 && (
              <Tooltip title="Notifications">
                <IconButton 
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                  }} 
                  onClick={handleMenuOpen}
                  aria-label="Notifications"
                >
                  <Badge 
                    badgeContent={notificationCount} 
                    color="error"
                  >
                    <WarningIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* Bouton changement de thème */}
            <Tooltip title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}>
              <IconButton 
                sx={{ 
                  ml: 1, 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }} 
                onClick={toggleColorMode}
                aria-label="Changer le thème"
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* Avatar et menu utilisateur */}
            <Tooltip title={`${userName} - ${userRole === 'admin' ? 'Administrateur' : 'Vendeur'}`}>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  p: 0, 
                  ml: 1,
                  '&:hover': { opacity: 0.9 }
                }}
                aria-label="Menu utilisateur"
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'secondary.main',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Menu utilisateur */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  width: 280,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* En-tête du menu */}
              <MenuItem disabled sx={{ py: 2, backgroundColor: 'rgba(26, 35, 126, 0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    boxShadow: '0 2px 8px rgba(26, 35, 126, 0.3)'
                  }}>
                    <img 
                      src={logo} 
                      alt="AFRITEXTIA Logo" 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userEmail}
                    </Typography>
                    <Chip 
                      label={userRole === 'admin' ? 'Administrateur' : 'Vendeur'}
                      size="small"
                      color={userRole === 'admin' ? 'primary' : 'success'}
                      sx={{ 
                        mt: 0.5, 
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Box>
              </MenuItem>
              
              <Divider />

              {/* Option de profil */}
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Mon profil
              </MenuItem>

              {/* Option dashboard */}
              <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                Tableau de bord AFRITEXTIA
              </MenuItem>

              {/* Option paramètres (admin seulement) */}
              {isAdmin() && (
                <MenuItem onClick={() => { handleMenuClose(); navigate('/parametres'); }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Paramètres système
                </MenuItem>
              )}

              <Divider />

              {/* Déconnexion */}
              <MenuItem 
                onClick={logoutUser}
                sx={{ 
                  color: 'error.main',
                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          {/* Header de la sidebar avec logo mini */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'rgba(26, 35, 126, 0.02)'
          }}>
            <Box sx={{ 
              width: 30, 
              height: 30, 
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3px'
            }}>
              <img 
                src={logo} 
                alt="AFRITEXTIA" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '0.8rem'
              }}
            >
              AFRITEXTIA
            </Typography>
          </Box>
          
          <List sx={{ p: 1 }}>
            {menuItems
              .filter(item => item.visible)
              .map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    component={Link} 
                    to={item.path}
                    selected={item.path === path}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.04)',
                      },
                      borderRadius: 1,
                      mx: 0.5,
                      py: 1,
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: item.path === path ? 'primary.contrastText' : 'inherit',
                        minWidth: 40
                      }}
                    >
                      {item.badge ? (
                        <Badge 
                          badgeContent={
                            item.text === 'Stocks' ? stocksFaibles.length :
                            item.text === 'Ventes' ? (ventesImpayeesCount + ventesRetardCount) :
                            0
                          } 
                          color="error" 
                          size="small"
                        >
                          {item.icon}
                        </Badge>
                      ) : item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: item.path === path ? '600' : '400'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
        
        {/* Section alertes */}
        {(isAdmin() || isVendeur()) && notificationCount > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider', 
            bgcolor: 'warning.light',
            borderLeft: '3px solid',
            borderLeftColor: 'warning.main'
          }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: 'warning.dark',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <WarningIcon fontSize="small" />
              Alertes AFRITEXTIA
            </Typography>
            
            {stocksFaibles.length > 0 && (
              <Typography 
                variant="caption" 
                color="error.main" 
                sx={{ 
                  display: 'block',
                  cursor: 'pointer',
                  '&:hover': { color: 'error.dark' }
                }}
                onClick={handleNotificationsClick}
              >
                ⚠️ {stocksFaibles.length} stock(s) faible(s)
              </Typography>
            )}
            
            {ventesImpayeesCount > 0 && (
              <Typography 
                variant="caption" 
                color="error.main" 
                sx={{ 
                  display: 'block',
                  cursor: 'pointer',
                  '&:hover': { color: 'error.dark' }
                }}
                onClick={handleVentesImpayeesClick}
              >
                💰 {ventesImpayeesCount} vente(s) impayée(s)
              </Typography>
            )}
            
            {ventesRetardCount > 0 && (
              <Typography 
                variant="caption" 
                color="error.main" 
                sx={{ 
                  display: 'block',
                  cursor: 'pointer',
                  '&:hover': { color: 'error.dark' }
                }}
                onClick={handleVentesRetardClick}
              >
                ⏰ {ventesRetardCount} vente(s) en retard
              </Typography>
            )}
            
            <Typography 
              variant="caption" 
              color="primary.main" 
              sx={{ 
                display: 'block', 
                mt: 1,
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 'bold',
                '&:hover': { 
                  color: 'primary.dark',
                  textDecoration: 'underline'
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              → Voir le tableau de bord
            </Typography>
          </Box>
        )}
        
        {/* Footer avec version */}
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: 'rgba(26, 35, 126, 0.02)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ fontSize: '0.75rem' }}
            >
              v2.1.0
            </Typography>
            <Chip 
              label="AFRITEXTIA Pro"
              size="small"
              color="primary"
              sx={{ 
                fontSize: '0.65rem', 
                height: 20,
                fontWeight: 'bold'
              }}
            />
          </Box>
          <Typography 
            variant="caption" 
            color="primary.main" 
            align="center"
            sx={{ 
              display: 'block', 
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          >
            {userRole === 'admin' ? 'Mode Administration' : 'Mode Vendeur'}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center"
            sx={{ 
              display: 'block', 
              fontSize: '0.65rem',
              mt: 0.5
            }}
          >
            © 2024 AFRITEXTIA
          </Typography>
        </Box>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          backgroundColor: 'background.default', 
          minHeight: '100vh' 
        }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
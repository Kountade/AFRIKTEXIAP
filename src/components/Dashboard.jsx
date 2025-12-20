// src/components/Dashboard.jsx
import AxiosInstance from './AxiosInstance'
import { React, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Refresh as RefreshIcon,
  Euro as EuroIcon,
  Warehouse as WarehouseIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()

  // Fonction pour charger les données
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('📊 Tentative de chargement du dashboard...')
      
      // Vérifier si nous avons un token
      const token = localStorage.getItem('Token')
      console.log('🔑 Token présent:', !!token)
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.')
      }

      // Essayer avec différentes URLs
      const endpoints = ['dashboard/', 'api/dashboard/']
      let response = null
      let lastError = null

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Essai avec endpoint: ${endpoint}`)
          response = await AxiosInstance.get(endpoint)
          console.log(`✅ Succès avec ${endpoint}:`, response.status)
          break
        } catch (err) {
          console.log(`❌ Échec avec ${endpoint}:`, err.response?.status || err.message)
          lastError = err
        }
      }

      if (!response) {
        throw lastError || new Error('Impossible de charger les données')
      }

      console.log('📦 Données reçues:', response.data)
      
      if (response.data) {
        setDashboardData(response.data)
      } else {
        throw new Error('Réponse vide du serveur')
      }
      
    } catch (error) {
      console.error('💥 Erreur complète:', error)
      
      let errorMessage = 'Erreur lors du chargement des données'
      let errorDetails = ''
      
      if (error.response) {
        // Erreur serveur
        const status = error.response.status
        const data = error.response.data
        
        console.log(`🔍 Détails erreur ${status}:`, data)
        
        switch(status) {
          case 401:
            errorMessage = 'Non authentifié'
            errorDetails = 'Votre session a expiré. Veuillez vous reconnecter.'
            // Rediriger vers login
            localStorage.removeItem('Token')
            localStorage.removeItem('User')
            window.location.href = '/login'
            break
          case 403:
            errorMessage = 'Accès interdit'
            errorDetails = 'Vous n\'avez pas les permissions nécessaires.'
            break
          case 404:
            errorMessage = 'API non trouvée'
            errorDetails = 'L\'endpoint dashboard n\'existe pas sur le serveur.'
            break
          case 500:
            errorMessage = 'Erreur serveur'
            errorDetails = 'Le serveur a rencontré une erreur interne.'
            break
          default:
            errorMessage = `Erreur ${status}`
            errorDetails = data?.detail || JSON.stringify(data)
        }
      } else if (error.request) {
        // Pas de réponse
        errorMessage = 'Serveur injoignable'
        errorDetails = `Vérifiez que :
        1. Le serveur Django est démarré
        2. L\'URL ${AxiosInstance.defaults.baseURL} est correcte
        3. Vous êtes connecté à internet`
      } else {
        // Erreur de configuration
        errorMessage = 'Erreur de configuration'
        errorDetails = error.message
      }
      
      setError(`${errorMessage}\n${errorDetails}`)
      
      // Données de démo pour continuer le développement
      console.log('🛠️ Utilisation des données de démo')
      setDashboardData(getDemoData())
    } finally {
      setLoading(false)
    }
  }

  // Données de démo
  const getDemoData = () => ({
    stats: {
      total_ventes: 156,
      chiffre_affaires: 45678.90,
      total_clients: 42,
      total_produits: 123,
      total_entrepots: 3,
      valeur_stock_total: 23456.78,
      chiffre_affaires_mois: 12345.67,
      chiffre_affaires_semaine: 4567.89
    },
    produits_low_stock: [
      { id: 1, nom: 'Smartphone X', stock_actuel: 2, stock_alerte: 5, statut: 'faible', code: 'SMX001' },
      { id: 2, nom: 'Ordinateur Portable', stock_actuel: 0, stock_alerte: 3, statut: 'rupture', code: 'LAP002' },
      { id: 3, nom: 'Écran 24"', stock_actuel: 4, stock_alerte: 10, statut: 'faible', code: 'MON003' }
    ],
    dernieres_ventes: [
      { id: 1, numero_vente: 'V20240123001', client_nom: 'Entreprise Tech', montant_total: 456.78, created_at: new Date().toISOString(), statut: 'confirmee' },
      { id: 2, numero_vente: 'V20240123002', client_nom: 'SARL Informatique', montant_total: 1234.56, created_at: new Date(Date.now() - 86400000).toISOString(), statut: 'confirmee' },
      { id: 3, numero_vente: 'V20240123003', client_nom: 'Particulier Dupont', montant_total: 789.12, created_at: new Date(Date.now() - 172800000).toISOString(), statut: 'confirmee' }
    ],
    entrepots: [
      { id: 1, nom: 'Entrepôt Principal', adresse: '123 Rue Principale, Paris', actif: true, produits_count: 56, stock_total_valeur: 12345.67 },
      { id: 2, nom: 'Entrepôt Secondaire', adresse: '456 Rue Secondaire, Lyon', actif: true, produits_count: 34, stock_total_valeur: 6789.01 }
    ],
    top_produits: [
      { id: 1, nom: 'Smartphone X', total_vendu: 45 },
      { id: 2, nom: 'Ordinateur Portable', total_vendu: 32 },
      { id: 3, nom: 'Écran 24"', total_vendu: 28 }
    ]
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (e) {
      return 'Date invalide'
    }
  }

  // Formatage d'argent
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  }

  // Composant de carte de statistique
  const StatsCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)' }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
              color: 'white',
              borderRadius: 3,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h5" color="textSecondary" fontWeight="600">
          Chargement du Dashboard...
        </Typography>
      </Box>
    )
  }

  if (error && !dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error"
          sx={{ 
            mb: 3,
            whiteSpace: 'pre-wrap',
            '& .MuiAlert-message': { width: '100%' }
          }}
          action={
            <Button color="inherit" size="small" onClick={fetchDashboardData}>
              Réessayer
            </Button>
          }
        >
          <Box>
            <Typography fontWeight="bold" gutterBottom>
              Erreur de chargement
            </Typography>
            <Typography variant="body2">
              {error.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </Typography>
          </Box>
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          sx={{ mb: 2 }}
        >
          Recharger les données
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.href = '/login'}
          sx={{ ml: 2 }}
        >
          Se reconnecter
        </Button>
      </Box>
    )
  }

  const { stats, produits_low_stock, dernieres_ventes, entrepots } = dashboardData || {}

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* En-tête */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tableau de Bord
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error ? '⚠️ Mode démo - Données de test' : 'Vue d\'ensemble de votre activité'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {error && (
            <Chip 
              label="Mode démo" 
              color="warning" 
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          <Tooltip title="Actualiser les données">
            <IconButton 
              onClick={fetchDashboardData} 
              color="primary"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Cartes de statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<MoneyIcon sx={{ fontSize: 24 }} />}
            title="CHIFFRE D'AFFAIRES"
            value={formatMoney(stats?.chiffre_affaires)}
            subtitle={`Mois: ${formatMoney(stats?.chiffre_affaires_mois)}`}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<ReceiptIcon sx={{ fontSize: 24 }} />}
            title="VENTES TOTALES"
            value={stats?.total_ventes?.toLocaleString('fr-FR') || '0'}
            subtitle="Transactions confirmées"
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<PeopleIcon sx={{ fontSize: 24 }} />}
            title="CLIENTS"
            value={stats?.total_clients?.toLocaleString('fr-FR') || '0'}
            subtitle="Clients actifs"
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<WarehouseIcon sx={{ fontSize: 24 }} />}
            title="ENTREPÔTS"
            value={stats?.total_entrepots?.toLocaleString('fr-FR') || '0'}
            subtitle={stats?.total_produits?.toLocaleString('fr-FR') + ' produits'}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Dernières ventes */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CartIcon />
              Dernières Ventes
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => window.location.href = '/ventes'}
            >
              Voir tout
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 600 }}>N° VENTE</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>CLIENT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>DATE</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>MONTANT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>STATUT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dernieres_ventes && dernieres_ventes.length > 0 ? (
                  dernieres_ventes.slice(0, 5).map((vente, index) => (
                    <TableRow key={vente.id || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="primary.main">
                          {vente.numero_vente}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {vente.client_nom || 'Vente directe'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(vente.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="600" color="success.main">
                          {formatMoney(vente.montant_total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vente.statut === 'confirmee' ? 'CONFIRMÉE' : vente.statut?.toUpperCase() || 'BROUILLON'}
                          color={vente.statut === 'confirmee' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        Aucune vente récente
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            Actions Rapides
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<ReceiptIcon />}
                onClick={() => window.location.href = '/ventes'}
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': { background: 'white' }
                }}
              >
                Nouvelle Vente
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<InventoryIcon />}
                onClick={() => window.location.href = '/produits'}
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': { background: 'white' }
                }}
              >
                Gérer Stock
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<ShippingIcon />}
                onClick={() => window.location.href = '/transferts'}
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': { background: 'white' }
                }}
              >
                Transferts
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<TrendingUpIcon />}
                onClick={() => window.location.href = '/statistiques'}
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': { background: 'white' }
                }}
              >
                Statistiques
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
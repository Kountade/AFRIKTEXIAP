import AxiosInstance from './AxiosInstance'
import { React, useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Chip,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  Avatar,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material'

const Produits = () => {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingProduit, setEditingProduit] = useState(null)
  const [produitToDelete, setProduitToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  const [filterStock, setFilterStock] = useState('')
  const theme = useTheme()

  // Formulaire produit
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    categorie: '',
    fournisseur: '',
    prix_achat: '',
    prix_vente: '',
    stock_alerte: 5,
    unite: 'unite'
  })

  // Récupérer les données
  const fetchData = () => {
    setLoading(true)
    Promise.all([
      AxiosInstance.get('produits/'),
      AxiosInstance.get('categories/'),
      AxiosInstance.get('fournisseurs/')
    ])
    .then(([produitsRes, categoriesRes, fournisseursRes]) => {
      setProduits(produitsRes.data)
      setCategories(categoriesRes.data)
      setFournisseurs(fournisseursRes.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error('Error fetching data:', err)
      setSnackbar({ open: true, message: 'Erreur lors du chargement des données', severity: 'error' })
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Ouvrir le dialog pour ajouter/modifier
  const handleOpenDialog = (produit = null) => {
    if (produit) {
      setEditingProduit(produit)
      setFormData({
        code: produit.code || '',
        nom: produit.nom || '',
        description: produit.description || '',
        categorie: produit.categorie || '',
        fournisseur: produit.fournisseur || '',
        prix_achat: produit.prix_achat || '',
        prix_vente: produit.prix_vente || '',
        stock_alerte: produit.stock_alerte || 5,
        unite: produit.unite || 'unite'
      })
    } else {
      setEditingProduit(null)
      setFormData({
        code: '',
        nom: '',
        description: '',
        categorie: '',
        fournisseur: '',
        prix_achat: '',
        prix_vente: '',
        stock_alerte: 5,
        unite: 'unite'
      })
    }
    setOpenDialog(true)
  }

  // Fermer le dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduit(null)
  }

  // Ouvrir la modal de suppression
  const handleOpenDeleteDialog = (produit) => {
    setProduitToDelete(produit)
    setOpenDeleteDialog(true)
  }

  // Fermer la modal de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setProduitToDelete(null)
  }

  // Gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!formData.code.trim() || !formData.nom.trim() || !formData.prix_achat || !formData.prix_vente) {
      setSnackbar({ open: true, message: 'Le code, nom, prix d\'achat et prix de vente sont obligatoires', severity: 'error' })
      return
    }

    if (parseFloat(formData.prix_vente) <= parseFloat(formData.prix_achat)) {
      setSnackbar({ open: true, message: 'Le prix de vente doit être supérieur au prix d\'achat', severity: 'error' })
      return
    }

    const submitData = {
      ...formData,
      prix_achat: parseFloat(formData.prix_achat),
      prix_vente: parseFloat(formData.prix_vente),
      stock_alerte: parseInt(formData.stock_alerte)
    }

    if (editingProduit) {
      // Modification
      AxiosInstance.put(`produits/${editingProduit.id}/`, submitData)
        .then(() => {
          setSnackbar({ open: true, message: 'Produit modifié avec succès', severity: 'success' })
          fetchData()
          handleCloseDialog()
        })
        .catch((err) => {
          console.error('Error updating produit:', err)
          setSnackbar({ open: true, message: 'Erreur lors de la modification', severity: 'error' })
        })
    } else {
      // Ajout
      AxiosInstance.post('produits/', submitData)
        .then(() => {
          setSnackbar({ open: true, message: 'Produit ajouté avec succès', severity: 'success' })
          fetchData()
          handleCloseDialog()
        })
        .catch((err) => {
          console.error('Error adding produit:', err)
          setSnackbar({ open: true, message: 'Erreur lors de l\'ajout', severity: 'error' })
        })
    }
  }

  // Supprimer un produit
  const handleDelete = () => {
    if (produitToDelete) {
      AxiosInstance.delete(`produits/${produitToDelete.id}/`)
        .then(() => {
          setSnackbar({ open: true, message: 'Produit supprimé avec succès', severity: 'success' })
          fetchData()
          handleCloseDeleteDialog()
        })
        .catch((err) => {
          console.error('Error deleting produit:', err)
          setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' })
        })
    }
  }

  // Filtrer les produits
  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produit.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategorie = !filterCategorie || produit.categorie == filterCategorie
    const matchesStock = !filterStock || 
                        (filterStock === 'low' && produit.stock_faible) ||
                        (filterStock === 'out' && produit.en_rupture) ||
                        (filterStock === 'normal' && !produit.stock_faible && !produit.en_rupture)
    
    return matchesSearch && matchesCategorie && matchesStock
  })

  // Statistiques
  const stats = {
    total: produits.length,
    en_rupture: produits.filter(p => p.en_rupture).length,
    stock_faible: produits.filter(p => p.stock_faible && !p.en_rupture).length,
    margeMoyenne: produits.length > 0 
      ? produits.reduce((acc, p) => acc + (p.prix_vente - p.prix_achat), 0) / produits.length 
      : 0
  }

  // Composant de carte de statistique amélioré
  const StatsCard = ({ icon, title, value, subtitle, color = 'primary', trend }) => (
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
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
              p: 2,
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

  // Avatar personnalisé pour les produits
  const ProductAvatar = ({ produit }) => (
    <Avatar
      sx={{
        bgcolor: produit.en_rupture 
          ? theme.palette.error.main 
          : produit.stock_faible 
            ? theme.palette.warning.main 
            : theme.palette.success.main,
        width: 40,
        height: 40
      }}
    >
      <InventoryIcon sx={{ fontSize: 20 }} />
    </Avatar>
  )

  // Calculer la marge
  const calculateMarge = (prixAchat, prixVente) => {
    if (!prixAchat || !prixVente) return 0
    return ((prixVente - prixAchat) / prixAchat * 100).toFixed(1)
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Chargement des produits...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* En-tête avec titre et bouton d'ajout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Gestion des Produits
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ opacity: 0.8 }}>
            Gérez votre catalogue produits efficacement
          </Typography>
        </Box>
        <Tooltip title="Ajouter un nouveau produit">
          <Fab 
            color="primary" 
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Cartes de statistiques améliorées */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<InventoryIcon sx={{ fontSize: 28 }} />}
            title="TOTAL PRODUITS"
            value={stats.total}
            subtitle="En catalogue"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<WarningIcon sx={{ fontSize: 28 }} />}
            title="STOCK FAIBLE"
            value={stats.stock_faible}
            subtitle="À réapprovisionner"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<WarningIcon sx={{ fontSize: 28 }} />}
            title="EN RUPTURE"
            value={stats.en_rupture}
            subtitle="Stock épuisé"
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            title="MARGE MOY."
            value={`${stats.margeMoyenne.toFixed(0)}%`}
            subtitle="Marge bénéficiaire"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Barres de recherche et filtres améliorés */}
      <Card sx={{ mb: 3, p: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un produit par code ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filterCategorie}
                label="Catégorie"
                onChange={(e) => setFilterCategorie(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {categories.map((categorie) => (
                  <MenuItem key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>État du stock</InputLabel>
              <Select
                value={filterStock}
                label="État du stock"
                onChange={(e) => setFilterStock(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Tous les stocks</MenuItem>
                <MenuItem value="normal">Stock normal</MenuItem>
                <MenuItem value="low">Stock faible</MenuItem>
                <MenuItem value="out">En rupture</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Tableau des produits amélioré */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                '& th': { 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }}>
                <TableCell>PRODUIT</TableCell>
                <TableCell>CATÉGORIE</TableCell>
                <TableCell align="right">PRIX ACHAT</TableCell>
                <TableCell align="right">PRIX VENTE</TableCell>
                <TableCell align="center">MARGE</TableCell>
                <TableCell align="center">STOCK</TableCell>
                <TableCell align="center">STATUT</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProduits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        {searchTerm || filterCategorie || filterStock ? 'Aucun produit trouvé' : 'Aucun produit enregistré'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {!searchTerm && !filterCategorie && !filterStock && 'Commencez par ajouter votre premier produit'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProduits.map((produit) => (
                  <TableRow 
                    key={produit.id} 
                    hover 
                    sx={{ 
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ProductAvatar produit={produit} />
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            {produit.nom}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            Code: {produit.code}
                          </Typography>
                          {produit.description && (
                            <Tooltip title={produit.description}>
                              <Typography variant="caption" color="textSecondary" sx={{ 
                                display: 'block',
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {produit.description}
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={produit.categorie_nom || 'Non catégorisé'}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="600">
                        {parseFloat(produit.prix_achat).toFixed(2)} €
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="600" color="success.main">
                        {parseFloat(produit.prix_vente).toFixed(2)} €
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${calculateMarge(produit.prix_achat, produit.prix_vente)}%`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        color={produit.en_rupture ? 'error.main' : produit.stock_faible ? 'warning.main' : 'success.main'}
                      >
                        {produit.stock_actuel || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Alerte: {produit.stock_alerte || 5}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {produit.en_rupture ? (
                        <Chip 
                          label="RUPTURE" 
                          color="error" 
                          size="small" 
                          sx={{ fontWeight: 600, borderRadius: 1 }}
                        />
                      ) : produit.stock_faible ? (
                        <Chip 
                          label="STOCK FAIBLE" 
                          color="warning" 
                          size="small" 
                          sx={{ fontWeight: 600, borderRadius: 1 }}
                        />
                      ) : (
                        <Chip 
                          label="DISPONIBLE" 
                          color="success" 
                          size="small" 
                          sx={{ fontWeight: 600, borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Modifier le produit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(produit)}
                            sx={{ 
                              background: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': { background: alpha(theme.palette.primary.main, 0.2) }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer le produit">
                          <IconButton 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(produit)}
                            sx={{ 
                              background: alpha(theme.palette.error.main, 0.1),
                              '&:hover': { background: alpha(theme.palette.error.main, 0.2) }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog pour ajouter/modifier un produit */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editingProduit ? 'Modifier le produit' : 'Nouveau produit'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code produit *"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom du produit *"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description détaillée du produit..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="categorie"
                  value={formData.categorie}
                  label="Catégorie"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Aucune catégorie</MenuItem>
                  {categories.map((categorie) => (
                    <MenuItem key={categorie.id} value={categorie.id}>
                      {categorie.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fournisseur</InputLabel>
                <Select
                  name="fournisseur"
                  value={formData.fournisseur}
                  label="Fournisseur"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalShippingIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Aucun fournisseur</MenuItem>
                  {fournisseurs.map((fournisseur) => (
                    <MenuItem key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Prix d'achat *"
                name="prix_achat"
                type="number"
                value={formData.prix_achat}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Prix de vente *"
                name="prix_vente"
                type="number"
                value={formData.prix_vente}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TrendingUpIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock d'alerte"
                name="stock_alerte"
                type="number"
                value={formData.stock_alerte}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WarningIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.code.trim() || !formData.nom.trim() || !formData.prix_achat || !formData.prix_vente}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {editingProduit ? 'Modifier le produit' : 'Créer le produit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de suppression moderne */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              margin: '0 auto 20px'
            }}
          >
            <DeleteIcon sx={{ fontSize: 40, color: 'error.main' }} />
          </Box>
          
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Confirmer la suppression
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Êtes-vous sûr de vouloir supprimer le produit <strong>"{produitToDelete?.nom}"</strong> ? 
            Cette action est irréversible et peut affecter les ventes associées.
          </Typography>

          {produitToDelete && (
            <Card variant="outlined" sx={{ mb: 3, p: 2, textAlign: 'left' }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Code:</strong> {produitToDelete.code}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Prix de vente:</strong> {produitToDelete.prix_vente} €
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Stock actuel:</strong> {produitToDelete.stock_actuel}
              </Typography>
              {produitToDelete.categorie_nom && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Catégorie:</strong> {produitToDelete.categorie_nom}
                </Typography>
              )}
            </Card>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2, 
              minWidth: 120,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Produits
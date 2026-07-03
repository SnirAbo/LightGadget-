import RegisterFormComp from "./componetns/Auth/RegisterForm"
import { Route, Routes } from 'react-router-dom'
import LoginFormComp from "./componetns/Auth/LoginForm"
import CategoryManager from "./componetns/Admin/CategoryManager"
import CustomerManager from "./componetns/Admin/CustomerManager"
import ProductManager from "./componetns/Admin/ProductManager"
import StatisticsDashboard from "./componetns/Admin/StatisticsDashboard"
import ProtectedRoute from "./componetns/Auth/ProtectedRoute"
import AdminPage from "./componetns/Admin/AdminPage"

import CustomerPage from "./componetns/Customer/CustomerPage"
import MyAccount from "./componetns/Customer/MyAccount"
import MyOrders from "./componetns/Customer/MyOrders"
import ProductCatalog from "./componetns/Customer/ProductCatalog"
import PaymentPage from "./componetns/Customer/PaymentPage"
import HomePage from "./pages/HomePage"

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    dispatch({ type: 'LOGIN_USER', payload: JSON.parse(storedUser) });
  }
  }, []);


  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginFormComp />} />
      <Route path='/register' element={<RegisterFormComp />} />

    <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
      <Route path='/admin' element={<AdminPage />}>
        <Route path='customer' element={<CustomerManager />} />
        <Route path='product' element={<ProductManager />} />
        <Route path='category' element= {<CategoryManager />} />
        <Route path='statistics' element={<StatisticsDashboard />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']}  />}>
      <Route path='/account' element={<CustomerPage />}>
        <Route path='myaccount' element={<MyAccount />} />
        <Route path='orders' element={<MyOrders />} />
        <Route path='products' element= {<ProductCatalog />} />
      </Route>
      <Route path='/payment' element={<PaymentPage />} />
    </Route>

    </Routes>
    </>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// import Products from "./pages/Products";
// import Customers from "./pages/Customers";
// import Billing from "./pages/Billing";
// import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={(name) => console.log(name)} />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="billing" element={<Billing />} />
          <Route path="reports" element={<Reports />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

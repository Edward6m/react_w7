import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Pagination from '../component/Pagination';
import ProductModal from '../component/ProductModal';
import DelProductModal from '../component/DelProductModal';
import Toast from "../component/Toast";
import RiseLoader from "react-spinners/RiseLoader";
import { pushMessage } from "../slice/toastSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
    const [newLoading, setNewLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(
                pushMessage({
                    status: "error",
                    message: "請先登入會員",
                })
            );
            navigate("/"); // 未登入則跳轉到首頁
        }
    }, [isAuthenticated, dispatch, navigate]);

    // Function to get products from API
    const getProducts = useCallback(async (page = 1) => {
        try {
            setNewLoading(true);
            // 如果 token 存在，將它添加到 Authorization 標頭中
            const headers = token ? {
                Authorization: `${token}`,
            } : {};
            // console.log(token);
            const res = await axios.get(
                `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`,
                { headers }
            );

            // Make sure the response has pagination data
            if (res.data && res.data.pagination) {
                setProducts(res.data.products);
                setPageInfo(res.data.pagination);
            } else {
                console.error('Pagination data is missing');
            }
            setNewLoading(false);
        } catch (error) {
            console.log(error.response);
            alert("get products fail", error.response.data.message);
            setNewLoading(false);
        }
    }, [token]);

    useEffect(() => {
        //refresh product list after logining  
        if (isAuthenticated) { getProducts(); }
    }, [getProducts, isAuthenticated]);
    const [modalMode, setModalMode] = useState('');

    // Modal for creating/editing products
    const handleOpenProductModal = (mode, product = defaultModalState) => {
        setModalMode(mode);
        setTempProduct(product || defaultModalState);
        setIsProductModalOpen(true);
    };

    const [tempProduct, setTempProduct] = useState(defaultModalState);

    // Modal for deleting products
    const handleOpenDelProductModal = (product) => {
        setTempProduct(product);
        setIsDelProductModalOpen(true);
    };

    const handlePageChange = (page) => {
        if (page !== pageInfo.current_page) {
            getProducts(page); // Fetch products when the page differs
        }
    };

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            {
                newLoading ? (
                    <div
                        className="container d-flex justify-content-center align-items-center"
                        style={{ height: "60vh" }}
                    >
                        <RiseLoader color="#966A09" size={30} />
                    </div>
                ) :
                    (
                        <div className="mt-25 container py-5 ">
                            <div className="d-flex justify-content-between ">
                                <h2>產品列表</h2>
                                <button
                                    onClick={() => handleOpenProductModal('create')}
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    建立新的產品
                                </button>
                            </div>
                            <div className="row">
                                <div className="col">

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">產品名稱</th>
                                                <th scope="col">原價</th>
                                                <th scope="col">售價</th>
                                                <th scope="col">是否啟用</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <th scope="row">{product.title}</th>
                                                    <td>{product.origin_price}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button
                                                                onClick={() => handleOpenProductModal('edit', product)}
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm"
                                                            >
                                                                編輯
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenDelProductModal(product)}
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                            >
                                                                刪除
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
                        </div>
                    )
            }

            <ProductModal
                modalMode={modalMode}
                getProducts={getProducts}
                tempProduct={tempProduct}
                isOpen={isProductModalOpen}
                setIsOpen={setIsProductModalOpen}
            />
            <DelProductModal
                tempProduct={tempProduct}
                isOpen={isDelProductModalOpen}
                setIsOpen={setIsDelProductModalOpen}
                getProducts={getProducts}
            />
            <Toast />
        </>
    );
}

export default ProductPage;
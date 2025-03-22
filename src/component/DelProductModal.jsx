import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { pushMessage } from "../slice/toastSlice";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({
    tempProduct,
    isOpen,
    setIsOpen,
    getProducts
}) {
    const delProductModalRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        new Modal(delProductModalRef.current, { backdrop: false });
    }, []);

    useEffect(() => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        if (isOpen && modalInstance) {
            modalInstance.show();
        }
    }, [isOpen]);

    const handleCloseDelProductModal = () => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
        setIsOpen(false); // 使用 setIsOpen，與 ProductPage 傳入一致
    };

    const { token } = useSelector((state) => state.user);


    // const res = await axios.get(
    //     `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`,
    //     { headers }
    // );
    const deleteProduct = async () => {
        try {
            const headers = token ? {
                Authorization: `${token}`,
            } : {};
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, { headers });
            dispatch(pushMessage({ text: "刪除產品成功", status: "success" }));
        } catch (error) {
            // alert('刪除產品失敗', error.data.message);
            const { message } = error.response.data;
            dispatch(pushMessage({ text: '刪除產品失敗' + message.join("、"), status: "failed" }));
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct();
            getProducts();
            handleCloseDelProductModal();
        } catch (error) {
            // alert('刪除產品失敗', error.data.message);
            const { message } = error.response.data;
            dispatch(pushMessage({ text: '刪除產品失敗' + message.join("、"), status: "failed" }));
        }
    };

    return (
        <div
            ref={delProductModalRef}
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除產品</h1>
                        <button
                            onClick={handleCloseDelProductModal}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                        <span className="text-danger fw-bold">{tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={handleCloseDelProductModal}
                            type="button"
                            className="btn btn-secondary"
                        >
                            取消
                        </button>
                        <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
DelProductModal.propTypes = {
    tempProduct: PropTypes.object.isRequired,   // tempProduct 是物件類型
    isOpen: PropTypes.bool.isRequired,          // isOpen 是布林類型
    setIsOpen: PropTypes.func.isRequired,       // setIsOpen 是函數類型
    getProducts: PropTypes.func.isRequired      // getProducts 是函數類型
};
export default DelProductModal;
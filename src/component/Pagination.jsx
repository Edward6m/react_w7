import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function Pagination({ pageInfo, handlePageChange }) {
    return (
        <div className="d-flex justify-content-center">
            <nav>
                <ul className="pagination">
                    {/* 上一頁 */}
                    <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                        <Link
                            to="#"
                            onClick={() => handlePageChange(pageInfo?.current_page - 1)}
                            className="page-link"
                            role="button"
                        >
                            上一頁
                        </Link>
                    </li>

                    {/* 頁碼列表 */}
                    {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
                        <li
                            key={index} // 為每個分頁加上唯一的 key
                            className={`page-item ${pageInfo?.current_page === index + 1 && 'active'}`}
                        >
                            <Link
                                to="#"
                                onClick={() => handlePageChange(index + 1)}
                                className="page-link"
                                role="button"
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}

                    {/* 下一頁 */}
                    <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                        <Link
                            to="#"
                            onClick={() => handlePageChange(pageInfo?.current_page + 1)}
                            className="page-link"
                            role="button"
                        >
                            下一頁
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

Pagination.propTypes = {
    pageInfo: PropTypes.shape({
        current_page: PropTypes.number,
        total_pages: PropTypes.number,
        has_pre: PropTypes.bool,
        has_next: PropTypes.bool
    }).isRequired,
    handlePageChange: PropTypes.func.isRequired
};

export default Pagination;

import React, { useEffect, useState } from 'react'

function Record() {

    const [data, setData] = useState({})
    const [dataList, setDataList] = useState([])
    const [search, setSearch] = useState('')
    const [symbol, setSymbol] = useState('')
    const [index, setIndex] = useState(-1)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    // pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    let currentItems = dataList.slice(indexOfFirstItem, indexOfLastItem)
    const totalPage = Math.ceil(dataList.length / itemsPerPage)

    useEffect(() => {
        let oldData = JSON.parse(localStorage.getItem('data')) || []
        setDataList(oldData)

        let savedPage = JSON.parse(localStorage.getItem('currentPage')) || 1
        setCurrentPage(savedPage)
    }, [])

    let handleInput = (e) => {
        let { name, value } = e.target

        setData({ ...data, [name]: value })
    }

    let handleSubmit = (e) => {
        e.preventDefault()

        let newList = []

        if (index != -1) {
            dataList[index] = data
            newList = [...dataList]
        } else {
            newList = [...dataList, data]
        }

        setDataList(newList)
        localStorage.setItem('data', JSON.stringify(newList))
        setData({})
        setIndex(-1)
    }

    let handleSearch = (e) => {
        console.log(e.target.value)
        setSearch(e.target.value)
    }

    let sortBy = (type) => {
        console.log("sortData")

        let newList
        if (type == 'uname') {
            if (symbol == '' || symbol == '(Z-A)') {
                newList = [...currentItems].sort((a, b) => {
                    return a.username.toString().localeCompare(b.username.toString())
                })
                setSymbol('(A-Z)')
            } else {
                newList = [...currentItems].sort((a, b) => {
                    return b.username.localeCompare(a.username)
                })
                setSymbol('(Z-A)')
            }
        } else {
            if (symbol == '' || symbol == '(Z-A)') {
                newList = [...currentItems].sort((a, b) => {
                    return a.email.toString().localeCompare(b.email.toString())
                })
                setSymbol('(A-Z)')
            } else {
                newList = [...currentItems].sort((a, b) => {
                    return b.email.localeCompare(a.email)
                })
                setSymbol('(Z-A)')
            }
        }

        let sortedList = [...dataList]
        sortedList.splice(indexOfFirstItem, currentItems.length, ...newList)
        setDataList(sortedList)
    }

    let handlePage = (page) => {
        setCurrentPage(page)
        localStorage.setItem('currentPage', JSON.stringify(page))
    }

    let handleEdit = (pos) => {
        let editData = dataList[pos]
        setData(editData)
        setIndex(pos)
    }

    let handleDelete = (pos) => {
        dataList.splice(pos, 1)
        let newList = [...dataList]
        setDataList(newList)
        localStorage.setItem('data', JSON.stringify(newList))
    }

    return (
        <>

            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div className="navbar-brand fw-bold">User Records</div>
                    <div className="collapse navbar-collapse">
                        <form className="d-flex ms-auto">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                onChange={handleSearch}
                            />
                        </form>
                        <div className="dropdown ms-3">
                            <button
                                className="btn btn-dark dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Sort By
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={() => sortBy('uname')}>
                                        Username {symbol}
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => sortBy('email')}>
                                        Email {symbol}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <form className="mb-4" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                onChange={handleInput}
                                value={data.username || ''}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={handleInput}
                                value={data.email || ''}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary mt-3"
                    >{index != -1 ? "Update Record" : "Add Record"}
                    </button>
                </form>

                <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.filter((val) => {
                            if (search === '') {
                                return val
                            } else if (val.username.toLowerCase().includes(search.toLowerCase()) ||
                                val.email.toLowerCase().includes(search.toLowerCase())) {
                                return val
                            }
                        }).map((val, idx) => (
                            <tr key={idx}>
                                <td>{val.username}</td>
                                <td>{val.email}</td>
                                <td>
                                    <button
                                        className='btn btn-danger me-1'
                                        onClick={() => handleDelete(indexOfFirstItem + idx)}
                                    >Delete
                                    </button>
                                    <button
                                        className='btn btn-primary'
                                        onClick={() => handleEdit(indexOfFirstItem + idx)}
                                    >Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>

                                {
                                    currentPage > 1 ?
                                        <button className='btn btn-outline-primary' onClick={() => handlePage(currentPage - 1)}>
                                            prev
                                        </button> :
                                        ''
                                }

                                {[...Array(totalPage)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePage(index + 1)}
                                        className={`btn mx-1 ${currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                {
                                    currentPage < totalPage ?
                                        <button
                                            onClick={() => handlePage(currentPage + 1)}
                                            className='btn btn-outline-primary'
                                        >
                                            next
                                        </button> :
                                        ''
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Record
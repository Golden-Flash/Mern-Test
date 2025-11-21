import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="py-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <Fragment key={index}>
                <div
                  onClick={(e) =>
                    history.push(`/products/category/${item._id}`)
                  }
                  className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <img
                    src={`${apiURL}/uploads/categories/${item.cImage}`}
                    alt="pic"
                  />
                  <div className="font-medium">{item.cName}</div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="text-xl text-center my-4">No Category</div>
        )}
      </div>
    </div>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [allProducts, setAllProducts] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      let responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        setAllProducts(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = () => {
    if (!allProducts) {
      return;
    };

    const min = minPrice === "" ? 0 : parseFloat(minPrice);
    const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);

    if (min < 0 || max < 0 || (maxPrice !== "" && min > max)) {
      return;
    }

    const filtered = allProducts.filter((item) => {
      const price = parseFloat(item.pPrice);
      console.log(price >= min, price <= max, price, min, max);
      
      return price >= min && price <= max;
    });

    dispatch({ type: "setProducts", payload: filtered });
  };

  const resetFilterBar = () => {
    setMinPrice("");
    setMaxPrice("");
    if (allProducts) {
      dispatch({ type: "setProducts", payload: allProducts });
    }
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col">
        <div className="font-medium py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 w-2/3 lg:w-3/4">
            <div className="flex flex-col">
              <label htmlFor="minPrice" className="text-sm mb-1">
                Min Price ($)
              </label>
              <input
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="border border-gray-300 rounded px-3 py-2 w-24 md:w-32 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <span className="text-gray-500 mt-6">-</span>
            <div className="flex flex-col">
              <label htmlFor="maxPrice" className="text-sm mb-1">
                Max Price ($)
              </label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="∞"
                className="border border-gray-300 rounded px-3 py-2 w-24 md:w-32 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button
              onClick={handleFilter}
              className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
            >
              Apply
            </button>
          </div>
          <div className="cursor-pointer" onClick={resetFilterBar}>
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray: productArray,
    });
  };

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const clearSearchBar = async () => {
    await fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${
        data.searchDropdown ? "" : "hidden"
      } my-4 flex items-center justify-between`}
    >
      <input
        value={search}
        onChange={(e) => searchHandle(e)}
        className="px-4 text-xl py-4 focus:outline-none"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={(e) => clearSearchBar()} className="cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;

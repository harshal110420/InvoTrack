import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEnterprises,
  getEnterpriseTree,
} from "../../../features/Enterprises/EnterpriseSlice";
import FlatListView from "./FlatListView";
import GroupedListView from "./GroupedListView";
import HierarchyView from "./HierarchyView";
import TreeView from "./TreeView";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";

const EnterprisePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enterpriseList, enterpriseTree, loading, error } = useSelector(
    (state) => state.enterprise
  );
  const [viewMode, setViewMode] = useState("flat");

  useEffect(() => {
    dispatch(fetchEnterprises());
  }, [dispatch]);

  useEffect(() => {
    if (enterpriseList.length > 0) {
      const headEnterprise = enterpriseList.find(
        (e) => e.enterpriseType === "HEAD"
      );
      if (headEnterprise) {
        dispatch(getEnterpriseTree(headEnterprise._id));
      }
    }
  }, [enterpriseList, dispatch]);

  const renderView = () => {
    switch (viewMode) {
      case "flat":
        return <FlatListView data={enterpriseList} />;
      case "grouped":
        return <GroupedListView data={enterpriseList} />;
      case "hierarchy":
        return <HierarchyView data={enterpriseList} />;
      case "tree":
        return <TreeView data={enterpriseTree} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          🏢 Enterprise Management
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="viewMode" className="text-gray-600 font-medium">
              View Mode:
            </label>
            <select
              id="viewMode"
              onChange={(e) => setViewMode(e.target.value)}
              value={viewMode}
              className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="flat">Flat List</option>
              <option value="grouped">Grouped by Type</option>
              <option value="hierarchy">Hierarchy View</option>
              <option value="tree">Tree View</option>
            </select>
          </div>

          <ButtonWrapper
            subModule="Enterprise management"
            permission="new"
          >
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => navigate("/module/admin-module/enterprise/create")}
            >
              ➕ Add Enterprise
            </button>
          </ButtonWrapper>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 min-h-[300px]">
        {loading ? (
          <p className="text-gray-500 text-center text-lg py-10">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center text-lg py-10">{error}</p>
        ) : (
          renderView()
        )}
      </div>
    </div>
  );
};

export default EnterprisePage;

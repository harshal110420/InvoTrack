import ButtonWrapper from "../components/ButtonWrapper";

const RolesPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

      <ButtonWrapper module="Roles" permission="create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">
          + Create Role
        </button>
      </ButtonWrapper>

      {/* Roles Table */}
      <div>...Roles List Table...</div>

      <ButtonWrapper module="Roles" permission="delete">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
          Delete Selected
        </button>
      </ButtonWrapper>
    </div>
  );
};

export default RolesPage;

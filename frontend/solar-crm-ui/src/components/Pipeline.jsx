// import { useEffect, useState } from "react";
// import api from "../api/api";
// import Swal from "sweetalert2";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import "./pipeline.css";

// import CustomerDetailsModal from "./CustomerDetailsModal";
// import FinanceForm from "./FinanceForm";
// import InstallationForm from "./InstallationForm";
// import DocumentUploadModal from "./DocumentUploadModal";
// import ContractForm from "./ContractForm";

// const stages = [
//   "IDENTIFICATION",
//   "DOCUMENTS",
//   "FINANCE",
//   "CONTRACT",
//   "INSTALLATION",
//   "COMPLETED"
// ];

// const stageHeaderClass = (stage) => {
//   switch (stage) {
//     case "IDENTIFICATION": return "columnHeader h-identification";
//     case "DOCUMENTS": return "columnHeader h-documents";
//     case "FINANCE": return "columnHeader h-finance";
//     case "CONTRACT": return "columnHeader h-contract";
//     case "INSTALLATION": return "columnHeader h-installation";
//     case "COMPLETED": return "columnHeader h-completed";
//     default: return "columnHeader";
//   }
// };

// function Pipeline() {

//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);

//   const [financeCustomerId, setFinanceCustomerId] = useState(null);
//   const [installationCustomerId, setInstallationCustomerId] = useState(null);
//   const [documentCustomerId, setDocumentCustomerId] = useState(null);
//   const [contractCustomerId, setContractCustomerId] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [stageFilter, setStageFilter] = useState("ALL");

//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   const pageSize = 5;

//   const fetchCustomers = () => {
//     api.get(`/customers/paged?page=${page}&size=${pageSize}`)
//       .then(res => {
//         setCustomers(res.data.content);
//         setTotalPages(res.data.totalPages);
//       })
//       .catch(err => console.error(err));
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [page]);

//   const onDragEnd = (result) => {

//     if (!result.destination) return;

//     const customerId = result.draggableId;
//     const newStage = result.destination.droppableId;

//     const customer = customers.find(c => c.id.toString() === customerId);

//     if (newStage === "DOCUMENTS" && !customer.document) {
//       Swal.fire({
//         icon: "warning",
//         title: "Upload Documents First"
//       });
//       return;
//     }

//     api.put(`/customers/${customerId}/stage?stage=${newStage}`)
//       .then(() => {

//         fetchCustomers();

//         Swal.fire({
//           icon: "success",
//           title: "Stage Updated",
//           timer: 1200,
//           showConfirmButton: false
//         });

//       })
//       .catch(err => {

//         Swal.fire({
//           icon: "error",
//           title: "Stage Change Failed",
//           text: err.response?.data?.message || "Invalid stage transition"
//         });

//       });
//   };

//   const filteredCustomers = customers.filter((c) => {

//     const matchesSearch =
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.phone && c.phone.includes(searchTerm));

//     const matchesStage =
//       stageFilter === "ALL" || c.stage === stageFilter;

//     return matchesSearch && matchesStage;
//   });

//   const stageCounts = stages.reduce((acc, stage) => {
//   acc[stage] = customers.filter(c => c.stage === stage).length;
//   return acc;
// }, {});

//   return (

//   <>
// <div className="pipelineHeader">

//   <div>
//     <h2 className="pipelineTitle">Sales Pipeline</h2>
//     <p className="pipelineSubtitle">Track customers through each stage</p>
//   </div>

//   <button
//     className="addCustomerBtn"
//     onClick={() => window.location.href="/add-customer"}
//   >
//     + Add Customer
//   </button>

// </div>

//       <DragDropContext onDragEnd={onDragEnd}>

//         {/* 🔍 Search + Filter (YOUR ORIGINAL STYLE KEPT) */}

//        <div className="pipelineToolbar">
//           <input
//             type="text"
//             placeholder="Search by name or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <select
//             value={stageFilter}
//             onChange={(e) => setStageFilter(e.target.value)}
//           >
//             <option value="ALL">All Stages</option>

//             {stages.map(stage => (
//               <option key={stage} value={stage}>
//                 {stage}
//               </option>
//             ))}

//           </select>

//         </div>


//         {/* Stage Summary */}

// <div className="stageSummary">

//   {stages.map(stage => (

//     <div key={stage} className="stagePill">

//       <span>{stage}</span>

//       <span className="pillCount">
//         {stageCounts[stage] || 0}
//       </span>

//     </div>

//   ))}

// </div>

//         {/* 🧩 Pipeline Board */}

// <div className="pipelineBoardWrapper">
//         <div className="board">

//           {stages.map(stage => {

//             const items = filteredCustomers.filter(c => c.stage === stage);

//             return (
//               <Droppable key={stage} droppableId={stage}>

//                 {(provided) => (

//                   <div
//                     className="column"
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >

//                     <div className={stageHeaderClass(stage)}>
//                       <span>{stage}</span>
//                       <span className="badge">{items.length}</span>
//                     </div>

//                     {items.length === 0 && (
//                       <div className="empty">
//                         Drop customers here
//                       </div>
//                     )}

//                     {items.map((c, index) => (

//                       <Draggable
//                         key={c.id.toString()}
//                         draggableId={c.id.toString()}
//                         index={index}
//                       >

//                         {(provided) => (

//                           <div
//                             className="card"
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{ ...provided.draggableProps.style }}
//                             title="Drag to change stage"
//                             onClick={() => setSelectedCustomerId(c.id)}
//                           >

//                             <div className="cardHeader">

//                               {c.stage === "IDENTIFICATION" && (
//                                 <button
//                                   className="documentBtn"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setDocumentCustomerId(c.id);
//                                   }}
//                                 >
//                                   📤 Upload Documents
//                                 </button>
//                               )}
                             
//                          <div className="cardBody">

//                                   <div className="avatar">
//                                     {c.name?.charAt(0)?.toUpperCase()}
//                                   </div>

//                                   <div className="cardInfo">

//                                     <div className="cardName">
//                                       {c.name}
//                                     </div>

//                                     <div className="cardPhone">
//                                       {c.phone || "No phone"}
//                                     </div>

//                                   </div>

//                                 </div>

//                             </div>

//                             {c.stage === "DOCUMENTS" && (
//                               <button
//                                 className="stageActionBtn financeBtn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setFinanceCustomerId(c.id);
//                                 }}
//                               >
//                                 + Add Finance
//                               </button>
//                             )}

//                             {c.stage === "FINANCE" && (
//                               <button
//                                 className="stageActionBtn contractBtn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setContractCustomerId(c.id);
//                                 }}
//                               >
//                                 + Add Contract
//                               </button>
//                             )}

//                             {c.stage === "CONTRACT" && (
//                               <button
//                                 className="stageActionBtn installationBtn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setInstallationCustomerId(c.id);
//                                 }}
//                               >
//                                 + Schedule Installation
//                               </button>
//                             )}

//                           </div>

//                         )}

//                       </Draggable>

//                     ))}

//                     {provided.placeholder}

//                   </div>

//                 )}

//               </Droppable>
//             );

//           })}

//         </div>
//       </div>

//         {/* Pagination */}

//         <div className="pagination">

//           <button
//             className="pageBtn"
//             disabled={page === 0}
//             onClick={() => setPage(prev => prev - 1)}
//           >
//             ←
//           </button>

//           <span className="pageInfo">
//             Page {page + 1} of {totalPages}
//           </span>

//           <button
//             className="pageBtn"
//             disabled={page + 1 === totalPages}
//             onClick={() => setPage(prev => prev + 1)}
//           >
//             →
//           </button>

//         </div>

//       </DragDropContext>

//       {/* Customer Details Modal */}

//       <CustomerDetailsModal
//         customerId={selectedCustomerId}
//         onClose={() => setSelectedCustomerId(null)}
//       />

//       {/* Finance Modal */}

//       {financeCustomerId && (
//         <FinanceForm
//           customerId={financeCustomerId}
//           onSuccess={() => {
//             setFinanceCustomerId(null);
//             fetchCustomers();
//           }}
//           onCancel={() => setFinanceCustomerId(null)}
//         />
//       )}

//       {/* Installation Modal */}

//       {installationCustomerId && (
//         <InstallationForm
//           customerId={installationCustomerId}
//           onSuccess={() => {
//             setInstallationCustomerId(null);
//             fetchCustomers();
//           }}
//           onCancel={() => setInstallationCustomerId(null)}
//         />
//       )}

//       {/* Document Modal */}

//       {documentCustomerId && (
//         <DocumentUploadModal
//           customerId={documentCustomerId}
//           onSuccess={async () => {

//             await api.put(`/customers/${documentCustomerId}/stage?stage=DOCUMENTS`);

//             setDocumentCustomerId(null);
//             fetchCustomers();

//           }}
//           onCancel={() => setDocumentCustomerId(null)}
//         />
//       )}

//       {/* Contract Modal */}

//       {contractCustomerId && (
//         <ContractForm
//           customerId={contractCustomerId}
//           onSuccess={() => {
//             setContractCustomerId(null);
//             fetchCustomers();
//           }}
//           onCancel={() => setContractCustomerId(null)}
//         />
//       )}

//     </>
//   );
// }

// export default Pipeline;

import { useState } from "react";
import PipelineTable from "./PipelineTable";
import CustomerDetailsModal from "./CustomerDetailsModal";
import FinanceForm from "./FinanceForm";
import InstallationForm from "./InstallationForm";
import DocumentUploadModal from "./DocumentUploadModal";
import ContractForm from "./ContractForm";
import { FiFilter, FiActivity } from "react-icons/fi"; // Added icons
import AssignLeadModal from "./AssignLeadModal";
import FollowUpModal from "./FollowUpModal";

function Pipeline() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [financeCustomerId, setFinanceCustomerId] = useState(null);
  const [installationCustomerId, setInstallationCustomerId] = useState(null);
  const [documentCustomerId, setDocumentCustomerId] = useState(null);
  const [contractCustomerId, setContractCustomerId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [assignCustomerId,setAssignCustomerId] = useState(null);
  const [showAssignModal,setShowAssignModal] = useState(false);

  const [followUpCustomerId, setFollowUpCustomerId] = useState(null);

  const refreshTable = () => {
    setRefreshKey(prev => prev + 1);
  };

  
  const handleAssignLead = (customerId) => {
  setAssignCustomerId(customerId);
  setShowAssignModal(true);
};

  return (
    <div className="pipelineContainer">
      <div className="pipelineHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
      <h2 className="pageTitle">Customer Pipeline</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '-20px' }}>
            <FiActivity style={{ marginRight: '5px' }} />
            Track and move customers through your sales workflow.
          </p>
        </div>
      </div>

      <PipelineTable
        key={refreshKey}
        onOpenCustomer={(id) => setSelectedCustomerId(id)}
        onAddFinance={(id) => setFinanceCustomerId(id)}
        onUploadDocs={(id) => setDocumentCustomerId(id)}
        onAddContract={(id) => setContractCustomerId(id)}
        onAddInstallation={(id) => setInstallationCustomerId(id)}
         onAssignLead={handleAssignLead}
          onAddFollowUp={(id) => setFollowUpCustomerId(id)} 
      />

      {/* --- Modals --- */}
      <CustomerDetailsModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      {financeCustomerId && (
        <FinanceForm
          customerId={financeCustomerId}
          onSuccess={() => {
            setFinanceCustomerId(null);
            refreshTable();      // ⭐ refresh pipeline
          }}
          onCancel={() => setFinanceCustomerId(null)}
        />
      )}

      {/* Installation */}
      {installationCustomerId && (
        <InstallationForm
          customerId={installationCustomerId}
          onSuccess={() => {
            setInstallationCustomerId(null);
            refreshTable();
          }}
          onCancel={() => setInstallationCustomerId(null)}
        />
      )}

      {/* Documents */}
      {documentCustomerId && (
        <DocumentUploadModal
          customerId={documentCustomerId}
          onSuccess={() => {
            setDocumentCustomerId(null);
            refreshTable();
          }}
          onCancel={() => setDocumentCustomerId(null)}
        />
      )}

      {/* Contract */}
      {contractCustomerId && (
        <ContractForm
          customerId={contractCustomerId}
          onSuccess={() => {
            setContractCustomerId(null);
            refreshTable();
          }}
          onCancel={() => setContractCustomerId(null)}
        />
      )}

      {showAssignModal && (
  <AssignLeadModal
    customerId={assignCustomerId}
    onClose={()=>{
      setShowAssignModal(false);
      setAssignCustomerId(null);
    }}
    onSuccess={()=>{
      setShowAssignModal(false);
      setAssignCustomerId(null);
      refreshTable();
    }}
  />
)}

{followUpCustomerId && (
  <FollowUpModal
    customerId={followUpCustomerId}
    onClose={() => setFollowUpCustomerId(null)}
    onSuccess={() => {
      setFollowUpCustomerId(null);
      refreshTable();
    }}
  />
)}
    </div>
  );
}

export default Pipeline;
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./pipelineTable.css";

const stages = [
  "DOCUMENTS",
  "FINANCE",
  "INSTALLATION",
  "CONTRACT",
  "COMPLETED"
];

const stageOrder = [
  "DOCUMENTS",
  "FINANCE",
  "INSTALLATION",
  "CONTRACT",
  "COMPLETED"
];

const colors = [
"#6366f1",
"#22c55e",
"#f59e0b",
"#ef4444"
];

const getStepClass = (current, step) => {
  const currentIndex = stageOrder.indexOf(current);
  const stepIndex = stageOrder.indexOf(step);
  return stepIndex <= currentIndex ? "progressDot active" : "progressDot";
};

const stageClasses = {
  DOCUMENTS:"b-documents",
  FINANCE:"b-finance",
  INSTALLATION:"b-installation",
  CONTRACT:"b-contract",
  COMPLETED:"b-completed"
};

const badgeClass = (stage) => `badgeStage ${stageClasses[stage] || ""}`;

export default function PipelineTable({
  onOpenCustomer,
  onAddFinance,
  onAddContract,
  onAddInstallation,
  onAssignLead,
  onAddFollowUp
}) {

  const [customers,setCustomers] = useState([]);
  const [search,setSearch] = useState("");
  const [debouncedSearch,setDebouncedSearch] = useState("");
  const [stageFilter,setStageFilter] = useState("ALL");

  const [page,setPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const pageSize = 10;
  const role = localStorage.getItem("role");

  const fetchCustomers = () => {
    api.get(`/customers/paged?page=${page}&size=${pageSize}`)
      .then(res=>{
        setCustomers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err=>console.error(err));
  };


const downloadExcel = async () => {

  const response = await api.get("/customers/export", {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.xlsx";
  link.click();
};

  useEffect(()=>{
    fetchCustomers();
  },[page]);

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setDebouncedSearch(search);
    },300);

    return ()=>clearTimeout(timer);
  },[search]);

  const filtered = useMemo(()=>{
    return customers.filter(c=>{

      const matchSearch =
        (c.name || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (c.phone || "").includes(debouncedSearch);

      const matchStage =
        stageFilter === "ALL" || c.stage === stageFilter;

      return matchSearch && matchStage;

    });
  },[customers,debouncedSearch,stageFilter]);


const stageCounts = useMemo(() => {
  const counts = {
    DOCUMENTS: 0,
    FINANCE: 0,
    INSTALLATION: 0,
    CONTRACT: 0,
    COMPLETED: 0
  };

  customers.forEach(c => {
    if (counts[c.stage] !== undefined) {
      counts[c.stage]++;
    }
  });

  return counts;
}, [customers]);


  const updateStage = (id,stage)=>{
    api.put(`/customers/${id}/stage?stage=${stage}`)
      .then(()=>{
        Swal.fire({
          icon:"success",
          title:"Stage Updated",
          timer:900,
          showConfirmButton:false
        });
        fetchCustomers();
      })
      .catch(err=>{
        Swal.fire({
          icon:"error",
          title:"Failed",
          text:err.response?.data?.message || "Invalid stage transition"
        });
      });
  };


  const canMoveToContract = (installation) => {
  return (
    installation &&
    installation.status === "COMPLETED" &&
    installation.photoUrl
  );
};

const canCompleteProject = (contract) => {
  return contract && contract.fileUrl;
};



  return (
    <div className="tableWrap">

      <div className="tableToolbar">

        <input
          className="tableSearch"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          className="tableSelect"
          value={stageFilter}
          onChange={(e)=>setStageFilter(e.target.value)}
        >
          <option value="ALL">All Stages</option>
          {stages.map(s=>(
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

<button className="downloadBtn" onClick={downloadExcel}>
⬇ Download Excel
</button>

      </div>

<button
  className="resetFilter"
  onClick={()=>setStageFilter("ALL")}>
  Show All
</button>

      <div className="pipelineSummary">

 {stages.map(stage => (
  <div
    key={stage}
    className={`pipelineStat ${stageFilter===stage ? "active" : ""}`}
    onClick={()=>setStageFilter(stage)}
  >

      <span className={`stageBadge ${stageClasses[stage]}`}>
        {stage}
      </span>

      <span className="stageCount">
        {stageCounts[stage]}
      </span>

    </div>
  ))}

</div>

      <div className="tableCard">

<div className="tableScroll">
        <table className="crmTable">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Stage</th>
              <th>Progress</th>
              <th>Finance</th>
              <th>Installation</th>
              <th>Created</th>
              <th style={{width:220}}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(c=>{

              console.log("Contract file =>", c.contract?.fileUrl);
console.log("File URL =>", `${process.env.REACT_APP_FILE_URL}/files/${c.contract?.fileUrl}`);

              const avatarColor = colors[c.id % colors.length];

              return(
                <tr key={c.id}>

                  <td className="nameCell">
                    <div
                      className="avatarSmall"
                      style={{background:avatarColor}}
                    >
                      {(c.name || "C")[0].toUpperCase()}
                    </div>

                    <div>
                      <div className="nameText">{c.name}</div>
                      <div className="subText">ID: {c.id}</div>
                    </div>
                  </td>
<td className="phoneCell">
  {c.phone ? (
    <div className="phoneActions">

      {/* Call */}
      <a href={`tel:${c.phone}`} className="phoneLink">
        📞 {c.phone}
      </a>

      {/* WhatsApp */}
 <a
  href={`https://wa.me/91${c.phone}?text=Hello%20${c.name},%20regarding%20your%20solar%20installation`}
  target="_blank"
  rel="noopener noreferrer"
  className="whatsappLink"
>
  💬
</a>

    </div>
  ) : "-"}
</td>

                  <td>{c.address || "-"}</td>

<td className="ownerCell">
  {c.ownerName ? (
    <div className="ownerBox">
      <div className="ownerAvatar">
        {c.ownerName[0].toUpperCase()}
      </div>
      {c.ownerName}
    </div>
  ) : "-"}
</td>

                  <td>
                    <span className={badgeClass(c.stage)}>
                      {c.stage}
                    </span>
                  </td>

                  <td>
                    <div className="stageProgress">
                      {stageOrder.map(step=>(
                        <span
                          key={step}
                          className={getStepClass(c.stage,step)}
                        ></span>
                      ))}
                    </div>
                  </td>

                  <td>
                    {c.finance ? (
                      <>
                        <div className="nameText">
                          {c.finance.financeType || "-"}
                        </div>
                        <div className="subText">
                          ₹{c.finance.loanAmount ?? "-"}
                        </div>
                      </>
                    ) : "-"}
                  </td>

                  <td>
                    {c.installation ? (
                      <>
                        <div className="nameText">
                          {c.installation.teamName || "-"}
                        </div>
                        <div className="subText">
                          {c.installation.installationDate || "-"}
                        </div>
                      </>
                    ) : "-"}
                  </td>

                  <td className="subText">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
 <div className="actionsRow">

{role === "ADMIN" && (
  <button
    className="btnAssign"
    onClick={(e)=>{
      e.stopPropagation();
      onAssignLead(c.id);
    }}
  >
    Assign
  </button>
)}

<button
  className="btnFollowUp"
  onClick={(e) => {
    e.stopPropagation();
    onAddFollowUp(c.id);
  }}
>
  📅 Follow Up
</button>

                      <button
                        className="btnView"
                        onClick={(e)=>{
                          e.stopPropagation();
                          onOpenCustomer(c.id);
                        }}
                      >
                        View
                      </button>

                      {c.stage==="DOCUMENTS" && (
                        <button
                          className="btnFinance"
                          onClick={(e)=>{
                            e.stopPropagation();
                            onAddFinance(c.id);
                          }}
                        >
                          Add Finance
                        </button>
                      )}

{/* {(c.stage === "INSTALLATION" || c.stage === "CONTRACT") && (
  <button
    className="btnContract"
    disabled={
      c.stage === "INSTALLATION" && !canMoveToContract(c.installation)
    }
    onClick={(e) => {
      e.stopPropagation();
      onAddContract(c.id);
    }}
  >
    {c.stage === "CONTRACT"
      ? c.contract
        ? "View Contract"
        : "Add Contract"
      : !canMoveToContract(c.installation)
        ? "Complete Installation First"
        : "Add Contract"}
  </button>
)} */}

{/* INSTALLATION BUTTON */}
{(c.stage === "FINANCE" || c.stage === "INSTALLATION") && (
  <button
    className="btnInstall"
    onClick={(e)=>{
      e.stopPropagation();

      if(!c.finance){
        Swal.fire({
          icon:"warning",
          title:"Add Finance First"
        });
        return;
      }

      onAddInstallation(c.id);
    }}
  >
    {c.installation
      ? c.installation.status === "COMPLETED"
        ? "View Installation"
        : "Complete Installation"
      : "Schedule Installation"}
  </button>
)}

{(c.stage === "INSTALLATION" || c.stage === "CONTRACT") && (
  <button
    className="btnContract"
    disabled={
      c.stage === "INSTALLATION" && !canMoveToContract(c.installation)
    }
    onClick={(e) => {
      e.stopPropagation();

      if (c.contract) {
        window.open(
          `${process.env.REACT_APP_FILE_URL}/files/${c.contract.fileUrl}`,
          "_blank"
        );
      } else {
        onAddContract(c.id);
      }
    }}
  >
    {c.contract
      ? "View Contract"
      : c.stage === "INSTALLATION" && !canMoveToContract(c.installation)
        ? "Complete Installation First"
        : "Add Contract"}
  </button>
)}
                      {/* {c.stage==="INSTALLATION" &&
                       c.installation?.status === "COMPLETED" &&
                         c.installation?.photoUrl && (
                        <button
                          className="btnContract"
                          onClick={(e)=>{
                            e.stopPropagation();
                            onAddContract(c.id);
                          }}
                        >
                          Add Contract
                        </button>
                      )} */}



                      {/* {c.stage==="CONTRACT" && c.contract?.fileUrl && (
                        <button
                          className="btnComplete"
                          onClick={(e)=>{
                            e.stopPropagation();
                            updateStage(c.id,"COMPLETED");
                          }}
                        >
                          Complete
                        </button>
                      )} */}

{c.stage === "CONTRACT" && (
  <button
    className="btnComplete"
    disabled={!canCompleteProject(c.contract)}
    onClick={(e) => {
      e.stopPropagation();
      updateStage(c.id, "COMPLETED");
    }}
  >
    {canCompleteProject(c.contract)
      ? "Mark Completed"
      : "Upload Contract First"}
  </button>
)}

                    </div>

                  </td>

                </tr>
              );

            })}

            {filtered.length===0 && (
              <tr>
                <td colSpan="9" className="emptyRow">
                  No customers found
                </td>
              </tr>
            )}

          </tbody>

        </table>
        </div>

        <div className="pagination">

          <button
            disabled={page===0}
            onClick={()=>setPage(page-1)}
          >
            ← Previous
          </button>

          <span>
            Page {page+1} of {totalPages}
          </span>

          <button
            disabled={page+1===totalPages}
            onClick={()=>setPage(page+1)}
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
}
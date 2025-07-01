import "./JobsTab.scss";
import { useState, useEffect, useContext } from 'react';
import { dateShort } from "../../../../utils/Helpers";

import { AuthContext } from "../../../../context/AuthContext";

import SpinLoader from "../../../../components/ui/SpinLoader";
import { JobsContext } from "../../context/JobsContext";

function JobsTab() {
    let DefaultJob = "";
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {isLoadingJobs, jobsList} = useContext(JobsContext);

    console.log(jobsList);

    return (

        <div className="jobs-tab">
            {isLoadingJobs 
                ? <SpinLoader />
                : 
                    <>
                        {jobsList && jobsList.length > 0 
                        
                            ? jobsList.map(job => (
                                <>
                                    <article className="admin-job-card" key={job.id}>
                                        <h3 className="job-name">{job.name}</h3>
                                        <div className="job-desc-img">
                                            <p className="job-description">{job.description}</p>
                                            <div>
                                                <img className="job-image"
                                                    src={job.img_path ? `${apiBase}/storage/${job.img_path}` : DefaultJob} 
                                                    alt={job.img_title ?? ""}
                                                    />
                                            </div>
                                        </div>
                                        <div className="job-dates">
                                            <p className="job-create">{dateShort(job.created_at)}</p>
                                            <p className="job-update">{dateShort(job.updated_at)}</p>
                                        </div>
                                    </article>
                                </>
                            ))

                            : <p>Il n'y à actuellement aucun métier en ligne.</p>
                        }
                    </>
            }
        </div>
    );
}

export default JobsTab;
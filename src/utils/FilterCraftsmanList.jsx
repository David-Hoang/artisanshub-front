export const filterCraftsmanList = (searchParams, list) => {

    let filteredList = list;

    if((searchParams.get('catId') && searchParams.get('catId') !== "") && (searchParams.get('region') && searchParams.get('region') !== "")) 
    {
        const region = searchParams.get(('region'));
        const jobId = parseInt(searchParams.get(('catId')));
        return list.filter((job) => job.user.region === region && job.craftsman_job_id === jobId);
    }

    if(searchParams.get('catId') && searchParams.get('catId') !== "")
    {
        const jobId = parseInt(searchParams.get(('catId')));
        return list.filter((job) => job.craftsman_job_id === jobId);
    }


    if(searchParams.get('region') && searchParams.get('region')!== "")
    {
        const region = searchParams.get(('region'));
        return list.filter((job) => job.user.region === region);
    }

    // if (Array.from(searchParams).length === 0 || searchParams.get('catId') === "") return filteredList;

    return filteredList;
}
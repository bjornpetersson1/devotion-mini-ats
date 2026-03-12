type Job = {
  id: string;
  title: string;
  description: string;
  customer_id: string;
};
type JobWithCustomer = Job & {
  customer?: Customer;
};

type Candidate = {
  id: string;
  name: string;
  linkedin_url: string;
  stage: string;
  job_id: string;
};

type Customer = {
  name: string;
};

type Profile = {
  id: string;
  email: string;
  customer_id: string;
};

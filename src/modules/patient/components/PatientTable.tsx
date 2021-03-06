import React, { ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Loader, Table } from '../../../components';
import DetailModal from './DetailModal';
import { deletePatient, getAllPatient } from '../api/apiFunctions';
import CreateModal from './CreateModal';
import DeleteModal from '../../global/DeleteModal';

function PatientTable():ReactElement {
  const [detailModal, setDetailModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const allpatient = useQuery('patients', getAllPatient);
  const [detailid, setDetailid] = React.useState('initial');
  const [data, setData] = React.useState<{headers:string[], body:string[][]}>({
    headers: ['Last Treatment Date', 'Name', 'Phone', 'Age', 'Address', 'Actions'],
    body: [[]],
  });

  const [chosenPatient, setChosenPatient] = React.useState<
  {
    id: string
    folderId: string
    reg: string
    name: string
    phone: string
    age: string
    address: string
    total: number
    date: string
    pTreatment: {[key: string]:{id: string; tname: string; tcharge: string, unit: number}[]}
    // eslint-disable-next-line max-len
    pMed: {[key: string]:{id: string; mname: string; price: string; count: number ; stock: string; max: number}[]}
    tDates: string[]
    mDates: string[]
    remark: string
    images: string[]
  }
  >();
  React.useEffect(() => {
    if (allpatient.data) {
      const patients:string[][] = [];
      allpatient.data.forEach((patient) => {
        patients.push([
          new Date(patient.date).toDateString(),
          patient.name,
          patient.phone,
          patient.age.toString(),
          patient.address,
          'actions',
          patient.id,
        ]);
      });
      setData({ ...data, body: patients });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allpatient.data, detailid]);

  React.useEffect(() => {
    if (detailid.length >= 10 && data.body.length > 0 && allpatient.data) {
      const patient = allpatient.data.find((e) => e.id === detailid);
      // eslint-disable-next-line max-len
      const pTreatment:{[key: string]:{id: string; tname: string; tcharge: string, unit: number}[]} = {};
      // eslint-disable-next-line max-len
      const pMed: {[key: string]:{id: string; mname: string; price: string; count: number ; stock: string; max: number}[]} = {};

      if (patient?.treatmentDates && patient?.treatment.length > 0) {
        for (let i = 0; i < patient?.treatmentDates.length; i += 1) {
          const key = patient?.treatmentDates[i];
          if (!pTreatment[key]) { pTreatment[key] = []; }
          pTreatment[key].push({
            // eslint-disable-next-line no-underscore-dangle
            id: patient?.treatment[i]._id,
            tname: patient?.treatment[i].name,
            tcharge: patient?.treatment[i].charge,
            unit: patient?.treCount[i],
          });
        }
      }
      if (patient?.medDates && patient?.medicine.length > 0) {
        for (let i = 0; i < patient?.medDates.length; i += 1) {
          const key = patient?.medDates[i];
          if (!pMed[key]) { pMed[key] = []; }
          pMed[key].push({
          // eslint-disable-next-line no-underscore-dangle
            id: patient?.medicine[i]._id,
            mname: patient?.medicine[i].name,
            price: patient?.medicine[i].price,
            count: patient?.medCount[i],
            stock: patient?.medicine[i].stock,
            max: +patient?.medicine[i].stock,
          });
        }
      }
      if (patient) {
        const chosenP = {
          id: patient.id,
          folderId: patient.folderId,
          reg: patient.reg,
          name: patient.name,
          phone: patient.phone,
          age: patient.age,
          address: patient.address,
          total: patient.total,
          date: patient.date,
          pTreatment,
          pMed,
          tDates: patient.treatmentDates,
          mDates: patient.medDates,
          remark: patient.remark,
          images: patient.images,
        };
        setChosenPatient(chosenP);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.body, detailid]);

  const queryClient = useQueryClient();

  // eslint-disable-next-line max-len
  const deleteP = useMutation((dataid:{id: string, folderId: string}) => deletePatient(dataid), {
    onSuccess: () => {
      setDeleteModal(false);
    },
  });
  const todelete = ():void => {
    if (chosenPatient) {
      setTimeout(() => {
        setData({ ...data, body: data.body.filter((e) => e[6] !== chosenPatient.id) });
      }, 100);
      setTimeout(() => {
        queryClient.removeQueries('patients');
      }, 100);
      deleteP.mutate({ id: chosenPatient.id, folderId: chosenPatient.folderId });
    }
  };
  return (
    <div>

      {
      detailModal && chosenPatient && (
      <DetailModal
        userdata={chosenPatient}
        setDetailModal={setDetailModal}
      />
      )
    }
      {
      editModal && chosenPatient && (
        <CreateModal
          modal={editModal}
          setModal={setEditModal}
          patientdata={chosenPatient}
        />
      )
    }
      {
        // eslint-disable-next-line no-nested-ternary
        deleteModal && !deleteP.isLoading ? (
          <DeleteModal
            setDeleteModal={setDeleteModal}
            confirm={todelete}
          />
        ) : deleteP.isLoading
          ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '200px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
                background: 'black',
                opacity: '0.8',
              }}
            >
              <Loader />
              <br />
              <span
                style={{
                  color: 'white',
                  opacity: '1',
                }}
              >
                Deleting Data

              </span>
            </div>
          )
          : null
      }
      <div style={{ width: '900px' }}>
        {
      allpatient.isLoading
        ? (
          <div
            style={{
              height: '400px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        )
        : (
          <Table
            setDetailModal={setDetailModal}
            setEditModal={setEditModal}
            setDeleteModal={setDeleteModal}
            setDetailid={setDetailid}
            data={data}

          />
        )
    }
      </div>
    </div>
  );
}

export default PatientTable;

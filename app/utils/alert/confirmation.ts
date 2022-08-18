import Swal from 'sweetalert2';

const confirmation = (callback: (isConfirmed: boolean) => void) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    const { isConfirmed } = result;
    callback(isConfirmed);
  });
};

export default confirmation;

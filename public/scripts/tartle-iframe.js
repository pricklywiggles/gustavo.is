// const ready = (callback) => {
//   if (document.readyState !== 'loading') {
//     callback();
//   } else {
//     document.addEventListener('DOMContentLoaded', callback);
//   }
// };

// function createTartleIframe() {
//   const targetDiv = document.getElementById('tartle-container');
//   if (!targetDiv) {
//     console.error("tartle-container div doesn't exist");
//     return;
//   }
//   const packetId = targetDiv.dataset.packetId;
//   const referralCode = targetDiv.dataset.referralCode;
//   const iframe = document.createElement('iframe');

//   // Configure iframe attributes
//   iframe.setAttribute('id', 'tartle-iframe');
//   iframe.setAttribute(
//     'src',
//     `http://localhost:3000/frictionless/embedded_packet?packet_id=${packetId}&referral_code=${referralCode}`
//   );
//   iframe.setAttribute('width', '500');
//   iframe.setAttribute('frameborder', '0');
//   iframe.setAttribute('allowtransparency', 'true');

//   // Attach the 'load' event listener
//   iframe.addEventListener('load', function () {
//     console.log('Sending tt-rd message');
//     iframe.contentWindow.postMessage({ action: 'tt-rd' }, '*');
//   });

//   // Find the target div by its ID and append the iframe

//   if (targetDiv) {
//     targetDiv.appendChild(iframe);
//   }
// }

// ready(function () {
//   window.addEventListener(
//     'message',
//     function (event) {
//       if (event.data.action === 'tt-pd' && event.data.width && event.data.height) {
//         console.log('Recieved:', event.data);
//         const iframe = document.getElementById('tartle-iframe');
//         if (iframe) {
//           iframe.style.width = event.data.width + 'px';
//           iframe.style.height = event.data.height + 'px';
//         }
//       }
//     },
//     false
//   );
//   createTartleIframe();
// });

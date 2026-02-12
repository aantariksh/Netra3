// Formspree Contact Form Handler
(function() {
  'use strict';

  // Update this with your Formspree form ID
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnnoekpj'

  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
      console.error('Contact form not found');
      return;
    }

    const submitButton = document.getElementById('contactFormSubmit');
    const originalButtonText = submitButton.innerHTML;

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Validate form using Bootstrap's validation
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      // Get form data
      const formData = new FormData(contactForm);
      
      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

      try {
        // Send data to Formspree
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          showMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
          contactForm.reset();
          contactForm.classList.remove('was-validated');
        } else {
          // Error from Formspree
          const data = await response.json();
          if (data.errors) {
            const errorMessages = data.errors.map(error => error.message).join(', ');
            showMessage('danger', `Oops! There was an error: ${errorMessages}`);
          } else {
            showMessage('danger', 'Oops! There was a problem submitting your form. Please try again.');
          }
        }
      } catch (error) {
        // Network or other error
        console.error('Form submission error:', error);
        showMessage('danger', 'Oops! There was a problem submitting your form. Please check your internet connection and try again.');
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });

    // Function to show success/error messages
    function showMessage(type, message) {
      // Remove any existing message
      const existingAlert = contactForm.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }

      // Create new alert
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} alert-dismissible fade show`;
      alert.setAttribute('role', 'alert');
      alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      // Insert alert before the form
      contactForm.insertAdjacentElement('beforebegin', alert);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        if (alert && alert.parentNode) {
          alert.classList.remove('show');
          setTimeout(() => {
            if (alert && alert.parentNode) {
              alert.remove();
            }
          }, 150);
        }
      }, 5000);

      // Scroll to message
      alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();


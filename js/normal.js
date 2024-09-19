function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
  
    if (isNaN(height) || isNaN(weight) || isNaN(age) || height <= 0 || weight <= 0 || !gender) {
      alert('Please fill out all fields with valid values!');
      return;
    }
  
    const bmi = weight / ((height / 100) ** 2);
    const bmiText = `Your BMI is ${bmi.toFixed(1)}`;
  
    document.getElementById('bmi-value').innerText = bmiText;
  
    // Update the category based on BMI
    const category = interpretBMI(bmi);
    document.getElementById('bmi-category').innerText = category;
  
    // Set range indicator
    const rangeSegments = document.querySelectorAll('.range-segment');
    rangeSegments.forEach(segment => segment.style.opacity = '0.4'); // Reset opacity for all segments
    let activeSegment;
    if (bmi < 18.5) {
      activeSegment = rangeSegments[0];
    } else if (bmi >= 18.5 && bmi < 25) {
      activeSegment = rangeSegments[1];
    } else if (bmi >= 25 && bmi < 30) {
      activeSegment = rangeSegments[2];
    } else {
      activeSegment = rangeSegments[3];
    }
    activeSegment.style.opacity = '1'; // Highlight the correct category
  }
  
  function interpretBMI(bmi) {
    if (bmi < 18.5) return 'Underweight';
    else if (bmi >= 18.5 && bmi <= 24.9) return 'Normal BMI';
    else if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    else return 'Obese';
  }

  
  
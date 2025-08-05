<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>

  <script>
    document.body.style.fontFamily = 'sans-serif';
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.background = '#f7f7f7';
    document.body.style.color = '#333';

    const header = document.querySelector('header');
    header.style.background = '#4f46e5';
    header.style.color = 'white';
    header.style.padding = '2rem';
    header.style.textAlign = 'center';

    const main = document.querySelector('main');
    main.style.padding = '2rem';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.marginBottom = '2rem';
    });

    const footer = document.querySelector('footer');
    footer.style.background = '#333';
    footer.style.color = 'white';
    footer.style.textAlign = 'center';
    footer.style.padding = '1rem';
  </script>
</body>

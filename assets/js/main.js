
(function () {

    /* ====================
    Preloader
    ======================= */
    window.onload = function () {
        window.setTimeout(fadeout, 300);
    }

    function fadeout() {
        document.querySelector('.preloader').style.opacity = '0';
        document.querySelector('.preloader').style.display = 'none';
    }


    window.onscroll = function () {
        var header_navbar = document.querySelector(".hero-section-wrapper-2 .header");
        var sticky = header_navbar.offsetTop;

        if (window.pageYOffset > sticky) {
            header_navbar.classList.add("sticky");
        } else {
            header_navbar.classList.remove("sticky");
        }

        // show or hide the back-top-top button
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };

    // header-5  toggler-icon
    let navbarToggler2 = document.querySelector(".header-2 .navbar-toggler");
    var navbarCollapse2 = document.querySelector(".header-2 .navbar-collapse");

    document.querySelectorAll(".header-2 .page-scroll").forEach(e =>
        e.addEventListener("click", () => {
            navbarToggler2.classList.remove("active");
            navbarCollapse2.classList.remove('show')
        })
    );
    navbarToggler2.addEventListener('click', function () {
        navbarToggler2.classList.toggle("active");
    })

    // section menu active
    function onScroll(event) {
        var sections = document.querySelectorAll('.page-scroll');
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        for (var i = 0; i < sections.length; i++) {
            var currLink = sections[i];
            var val = currLink.getAttribute('href');
            var refElement = document.querySelector(val);
            var scrollTopMinus = scrollPos + 73;
            if (refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
                document.querySelector('.page-scroll').classList.remove('active');
                currLink.classList.add('active');
            } else {
                currLink.classList.remove('active');
            }
        }
    };

    window.document.addEventListener('scroll', onScroll);


    //====== counter up 
    var cu = new counterUp({
        start: 0,
        duration: 2000,
        intvalues: true,
        interval: 100,
        append: " ",
    });
    cu.start();

    // WOW active
    new WOW().init();

    // Chat widget functionality
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    let sessionId = Date.now().toString();

    chatButton.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    });

    chatMinimize.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja encerrar a conversa?')) {
            fetch('https://n8n.tock.app.br/webhook/site-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'chat encerrado', sessionId: '0' }),
            }).then(() => {
                chatWindow.style.display = 'none';
            });
        }
    });

    chatSend.addEventListener('click', () => sendMessage());

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    document.getElementById('finalize-service').addEventListener('click', () => sendMessage('finalizar atendimento', 'finalizar'));
    document.getElementById('restart-chat').addEventListener('click', () => {
        sendMessage('recomeçar', 'recomeçar');
        // After sending, clear messages and regenerate sessionId
        setTimeout(() => {
            chatMessages.innerHTML = '';
            sessionId = Date.now().toString();
        }, 1000); // small delay to allow the message to be sent
    });

    function sendMessage(customMessage = null, type = 'message') {
        const message = customMessage || chatInput.value.trim();
        if (!message) return;
        addMessage(message, 'user');
        if (!customMessage) chatInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'message bot';
        typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send to n8n
        fetch('https://n8n.tock.app.br/webhook/site-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, sessionId, type }),
        })
            .then(response => response.json())
            .then(data => {
                // Hide typing indicator
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) typingIndicator.remove();
                addMessage(data.message || 'Sorry, I didn\'t understand that.', 'bot');
            })
            .catch(error => {
                // Hide typing indicator
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) typingIndicator.remove();
                addMessage('Opa, estou com um volume grande de dados, jajá te atendo!', 'bot');
                console.error('Error:', error);
            });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

})();
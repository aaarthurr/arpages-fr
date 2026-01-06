// color palette :
//
//  BLACK : 03020C
//  gray : C9C3BD
//  RED : A8201A
//  Light RED : FF6B6B
//  Mint : 10AC84
//  Purple : 5F27CD
//
//
//

const RED_HEX = 0xA8201A;
const PINK_HEX = 0xFF6B6B;
const BLACK_HEX = 0x03020C;
const GRAY_HEX = 0xE8DFD7;;
const MINT_HEX = 0x10AC84;
const PURPLE_HEX = 0x5F27CD;
const ORANGE_HEX = 0xFF9F43;
const BLUE_HEX = 0x0f70d1ff;

export const skillKeys = [
{
    id: 1,
    name: "Makefile",
    url: "https://github.com/yourusername",
    icon: "makefile.png",
    color: RED_HEX,
    lvl: 75,
    para: "<b>Makefile</b> is a build automation tool. I use it to <i>simplify program execution</i> and <i>automate compilation</i>, particularly in <u>C/C++</u> and <u>Docker</u> environments."
  },
  {
    id: 2,
    name: "Slack",
    url: "https://linkedin.com/in/yourusername",
    icon: "slack.png",
    color: BLACK_HEX,
    lvl: 90,
    para: "<b>Slack</b> is a collaboration hub. I utilize it for efficient <u>team communication</u> and <u>project management</u>, helping to <i>streamline workflows</i> and <i>centralize notifications</i>."
  },
  {
    id: 3,
    name: "Nginx",
    url: "mailto:your@email.com",
    icon: "nginx.png",
    color: BLUE_HEX,
    lvl: 45,
    para: "<b>Nginx</b> is a high-performance web server and <u>reverse proxy</u>. I use it to <i>optimize web traffic</i> and ensure high availability through <u>load balancing</u> and static content caching."
  },
  {
    id: 4,
    name: "Spring Boot",
    url: "mailto:your@email.com",
    icon: "springboot.png",
    color: MINT_HEX,
    lvl: 55,
    para: "<b>Spring Boot</b> is a Java-based framework for building web applications. I leverage it to create <i>robust</i> and <i>scalable</i> backend services with minimal configuration, focusing on <u>rapid development</u> and <u>microservices architecture</u>."
  },
  {
    id: 5,
    name: "Postman",
    url: "mailto:your@email.com",
    icon: "postman.png",
    color: ORANGE_HEX,
    lvl: 80,
    para: "<b>Postman</b> is an API development tool. I use it to <i>test</i>, <i>debug</i>, and <i>document</i> APIs, facilitating efficient <u>collaboration</u> between frontend and backend teams during the development process."
  },
  {
    id: 6,
    name: "Shell",
    url: "mailto:your@email.com",
    icon: "shell.png",
    color: GRAY_HEX,
    lvl: 60,
    para: "<b>Shell</b> and <b>Bash</b> are command-line interpreters. I use them for <i>automation</i>, <i>scripting</i>, and <i>system administration</i>, enabling efficient management of Unix-like operating systems."
  },
  {
    id: 7,
    name: "cpp",
    url: "mailto:your@email.com",
    icon: "cpp.png",
    color: ORANGE_HEX,
    lvl: 85,
    para: "<b>C++</b> is a powerful programming language. I use it for <i>system/software development</i>, <i>game development</i>, and performance-critical applications, leveraging its <u>object-oriented</u> and <u>generic programming</u> capabilities."
  },
  {
    id: 8,
    name: "Django",
    url: "mailto:your@email.com",
    icon: "django.png",
    color: PINK_HEX,
    lvl: 70,
    para: "<b>Django</b> is a high-level Python web framework. I use it to build <i>secure</i> and <i>maintainable</i> web applications quickly, utilizing its <u>built-in features</u> for authentication, database management, and templating."
  },
  {
    id: 9,
    name: "Linux",
    url: "mailto:your@email.com",
    icon: "linux.png",
    color: BLUE_HEX,
    lvl: 95,
    para: "<b>Linux</b> is an open-source operating system. I use it for <i>development</i>, <i>server management</i>, and <i>scripting</i>, taking advantage of its <u>stability</u>, <u>security</u>, and extensive <u>command-line tools</u>."
  },
  {
    id: 10,
    name: "Vue",
    url: "mailto:your@email.com",
    icon: "vue.png",
    color: PURPLE_HEX,
    lvl: 40,
    para: "<b>Vue.js</b> is a progressive JavaScript framework for building user interfaces. I use it to create <i>dynamic</i> and <i>responsive</i> web applications, focusing on <u>component-based architecture</u> and <u>reactive data binding</u>."
  },
  {
    id: 11,
    name: "Git",
    url: "mailto:your@email.com",
    icon: "git.png",
    color: PINK_HEX,
    lvl: 70,
    para: "<b>Git</b> is a distributed version control system. I use it to manage source code, track changes, and collaborate with other developers efficiently, ensuring a smooth development workflow."
  },
  {
    id: 12,
    name: "Java",
    url: "mailto:your@email.com",
    icon: "java.png",
    color: MINT_HEX,
    lvl: 60,
    para: "<b>Java</b> is a versatile programming language. I use it for building <i>cross-platform applications</i>, <i>enterprise solutions</i>, and <i>Android apps</i>, leveraging its <u>object-oriented principles</u> and extensive ecosystem."
  },
  {
    id: 13,
    name: "Docker",
    url: "mailto:your@email.com",
    icon: "docker.png",
    color: PURPLE_HEX,
    lvl: 85,
    para: "<b>Docker</b> is a containerization platform. I use it to <i>package</i>, <i>deploy</i>, and <i>manage applications</i> in lightweight containers, ensuring consistency across different environments and simplifying the deployment process."
  },
  {
    id: 14,
    name: "Python",
    url: "mailto:your@email.com",
    icon: "python.png",
    color: BLACK_HEX,
    lvl: 90,
    para: "<b>Python</b> is a high-level programming language. I use it for <i>web development</i>, <i>data analysis</i>, <i>automation</i>, and <i>machine learning</i>, appreciating its <u>readability</u> and extensive libraries."
  },
  {
    id: 15,
    name: "PostgreSQL",
    url: "mailto:your@email.com",
    icon: "postgresql.png",
    color: RED_HEX,
    lvl: 75,
    para: "<b>PostgreSQL</b> is a powerful open-source relational database. I use it for <i>data storage</i>, <i>management</i>, and <i>analysis</i>, leveraging its advanced features like <u>ACID compliance</u>, <u>extensibility</u>, and support for complex queries."
  }
];
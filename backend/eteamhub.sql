--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'leader',
    'player',
    'admin'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    action character varying NOT NULL,
    "targetType" character varying,
    "targetId" integer,
    detail json,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    note character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "eventId" integer,
    "playerId" integer
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying NOT NULL,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    type character varying NOT NULL,
    note character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "teamId" integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    content character varying NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    type character varying DEFAULT 'other'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    "fullName" character varying NOT NULL,
    ign character varying NOT NULL,
    role character varying NOT NULL,
    "gameAccount" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "teamId" integer
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: team_invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_invites (
    id integer NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "teamId" integer,
    "playerId" integer
);


ALTER TABLE public.team_invites OWNER TO postgres;

--
-- Name: team_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_invites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_invites_id_seq OWNER TO postgres;

--
-- Name: team_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_invites_id_seq OWNED BY public.team_invites.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "leaderId" integer
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.users_role_enum DEFAULT 'player'::public.users_role_enum NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: team_invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites ALTER COLUMN id SET DEFAULT nextval('public.team_invites_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, action, "targetType", "targetId", detail, "createdAt", "userId") FROM stdin;
1	create_team	team	3	{"name":"Team test","description":"Đội tuyển hàng đầu"}	2025-07-09 16:48:25.025817	1
2	update_user	user	2	{"before":{"id":2,"email":"player1@example.com","password":"$2b$10$d2oDWQy1KYTjEVIe3CaOaeVA71wKa1WvSs4trFtHKDNbJ0CJrn5NO","role":"player"},"after":{"id":2,"email":"newemail@example.com","role":"player"}}	2025-07-10 00:45:14.416349	1
3	change_password	user	2	{"userId":2}	2025-07-10 00:47:51.87878	2
4	update_profile	user	2	{"before":{"id":2,"email":"newemail@example.com","password":"$2b$10$1STanK5Wm7vGHHQYArnkAufA9OiherwYmO.jJosYc0HmdOiy8lh4a","role":"player","player":{"id":2,"fullName":"Nguyễn Văn A","ign":"ProGamer123","role":"ADC","gameAccount":"account123","createdAt":"2025-07-09T08:58:43.998Z","updatedAt":"2025-07-09T17:48:43.964Z"}},"after":{"id":2,"email":"updated@example.com","password":"$2b$10$1STanK5Wm7vGHHQYArnkAufA9OiherwYmO.jJosYc0HmdOiy8lh4a","role":"player","player":{"id":2,"fullName":"Nguyễn Văn A","ign":"ProGamer123","role":"ADC","gameAccount":"account123","createdAt":"2025-07-09T08:58:43.998Z","updatedAt":"2025-07-09T17:48:43.964Z"}}}	2025-07-10 00:48:43.965722	2
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, status, note, "createdAt", "updatedAt", "eventId", "playerId") FROM stdin;
1	present	Có mặt đúng giờ	2025-07-09 16:05:36.941842	2025-07-09 16:10:18.14286	1	2
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, "startTime", "endTime", type, note, "createdAt", "updatedAt", "teamId") FROM stdin;
1	Luyện tập test	2025-07-11 01:00:00	2025-07-11 03:00:00	Luyện tập	Tập trung đúng giờ	2025-07-09 16:05:36.936925	2025-07-09 16:05:36.936925	1
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, content, "isRead", type, "createdAt", "userId") FROM stdin;
1	Bạn được mời vào team Team Alpha	f	invite	2025-07-09 16:04:04.462159	2
2	Bạn được mời vào team Team Alpha	f	invite	2025-07-09 16:04:11.091133	3
3	Team Team Alpha có sự kiện mới: Luyện tập test	f	event	2025-07-09 16:05:36.944348	2
4	Player Player Name 1 đã tham gia sự kiện Luyện tập test	f	rsvp	2025-07-09 16:05:56.830166	1
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, "fullName", ign, role, "gameAccount", "createdAt", "updatedAt", "userId", "teamId") FROM stdin;
1	Leader Name	LeaderIGN	Top	Leader#123	2025-07-09 15:58:20.213882	2025-07-09 15:58:20.213882	1	\N
3	Player Name 3	Player3IGN	ADC	Player3#456	2025-07-09 16:00:08.477241	2025-07-09 16:00:08.477241	3	\N
4	Player Name 4	Player4IGN	ADC	Player4#456	2025-07-09 16:00:11.065139	2025-07-09 16:00:11.065139	4	\N
5	Player Name 5	Player5IGN	ADC	Player5#456	2025-07-09 16:00:12.760271	2025-07-09 16:00:12.760271	5	\N
6	Player Name 6	Player6IGN	ADC	Player6#456	2025-07-09 16:00:14.4626	2025-07-09 16:00:14.4626	6	\N
7	Player Name 7	Player7IGN	ADC	Player7#456	2025-07-09 16:00:16.037177	2025-07-09 16:00:16.037177	7	\N
8	Player Name 8	Player8IGN	ADC	Player8#456	2025-07-09 16:00:17.873095	2025-07-09 16:00:17.873095	8	\N
9	Player Name 9	Player9IGN	ADC	Player9#456	2025-07-09 16:00:19.846834	2025-07-09 16:00:19.846834	9	\N
10	Player Name 10	Player10IGN	ADC	Player10#456	2025-07-09 16:00:21.773958	2025-07-09 16:00:21.773958	10	\N
11	Player Name 11	Player11IGN	ADC	Player11#456	2025-07-09 16:00:23.4861	2025-07-09 16:00:23.4861	11	\N
12	Player Name 12	Player12IGN	ADC	Player12#456	2025-07-09 16:00:25.604608	2025-07-09 16:00:25.604608	12	\N
13	Player Name 13	Player13IGN	ADC	Player13#456	2025-07-09 16:00:27.32041	2025-07-09 16:00:27.32041	13	\N
14	Player Name 14	Player14IGN	ADC	Player14#456	2025-07-09 16:00:29.227238	2025-07-09 16:00:29.227238	14	\N
15	Player Name 15	Player15IGN	ADC	Player15#456	2025-07-09 16:00:30.97074	2025-07-09 16:00:30.97074	15	\N
2	Nguyễn Văn A	ProGamer123	ADC	account123	2025-07-09 15:58:43.998712	2025-07-10 00:48:43.964227	2	1
\.


--
-- Data for Name: team_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_invites (id, status, "createdAt", "updatedAt", "teamId", "playerId") FROM stdin;
2	pending	2025-07-09 16:04:11.088455	2025-07-09 16:04:11.088455	1	3
1	accepted	2025-07-09 16:04:04.459499	2025-07-09 16:05:14.747841	1	2
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, description, "createdAt", "updatedAt", "leaderId") FROM stdin;
1	Team Alpha	Đội tuyển hàng đầu	2025-07-09 16:03:33.639366	2025-07-09 16:03:33.639366	1
2	Team Alpha 2	Đội tuyển hàng đầu	2025-07-09 16:03:40.750706	2025-07-09 16:03:40.750706	1
3	Team test	Đội tuyển hàng đầu	2025-07-09 16:48:25.018987	2025-07-09 16:48:25.018987	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role) FROM stdin;
3	player3@example.com	$2b$10$ycu/5joW2tr5uUgbHO9bLuemxtLcgk9a2KzvFNvzMEDnMS2kHIr9i	player
4	player4@example.com	$2b$10$wt/nJ6TU5K8vGVbjBIWbDOcdV/hEKvB6XVtiIrtLFIUEKjHBQfDOK	player
5	player5@example.com	$2b$10$WywNilhuhEyKS29C8r74D.4akEH19xQCD2RPd6VzbPRGgpXHmGMpq	player
6	player6@example.com	$2b$10$C199dRpwgJuzgNxxmNqx5.YD6SQ72V27jixbaWuuXES3rGOEBHLJ.	player
7	player7@example.com	$2b$10$q93c7y75Tb36m8.AYJgX8ull8e0OyRS4SQBEwfHa847I8t.MiHWp6	player
8	player8@example.com	$2b$10$0gQevhIJGYc5rBS0/petp.rUWYZBLJKPWWGAWXuBbTakquLH8Chau	player
9	player9@example.com	$2b$10$s4NkHCUJWrhhcnlhSrrDVO8vtjo9vMX/Yfrl0MvK.TxJhZAF/Gn02	player
10	player10@example.com	$2b$10$70bar.Cnwn7bl6So20NESe7GM2z3hFaOtD7dqz/AYPs7c3lPWKJvW	player
11	player11@example.com	$2b$10$sq8rRwcNUz/aP03jFPDnaOswPOOxAWNC.vse/Qkm5Df08UsxvHLEi	player
12	player12@example.com	$2b$10$XFZxZmz.n3AUvNiyQtLoTOS33EtvhSc0FtwpkGX0EeEOA5c43Tbwu	player
13	player13@example.com	$2b$10$klEgQaQpQtZWq5Vo.222IuX64NUK.CueigehgMfchPf4WU1OKU8xO	player
14	player14@example.com	$2b$10$9DZOggMg65Jof6UqBcHZhe2IqnoXRd3aUoBp6PEWP5.cGx4A7gHyu	player
15	player15@example.com	$2b$10$Aa5MLp/xxyxjvNA4Yb.ri.rLqYYPyZP4Kx2bxiAp1bU80tRUPxy2y	player
1	leader@example.com	$2b$10$TXFvqkALy7kQIT/Ny6biSuXgj6/0Cvhj/kcNp9uV4SXj6w7JzZZDe	player
2	updated@example.com	$2b$10$1STanK5Wm7vGHHQYArnkAufA9OiherwYmO.jJosYc0HmdOiy8lh4a	player
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 4, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 1, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 4, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 15, true);


--
-- Name: team_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_invites_id_seq', 2, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- Name: team_invites PK_2df756220f694d8f6cf5d0988ec; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "PK_2df756220f694d8f6cf5d0988ec" PRIMARY KEY (id);


--
-- Name: events PK_40731c7151fe4be3116e45ddf73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: teams PK_7e5523774a38b08a6236d322403; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: players PK_de22b8fdeee0c33ab55ae71da3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY (id);


--
-- Name: attendance PK_ee0ffe42c1f1a01e72b725c0cb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY (id);


--
-- Name: activity_logs PK_f25287b6140c5ba18d38776a796; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY (id);


--
-- Name: players REL_7c11c744c0601ab432cfa6ff7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "REL_7c11c744c0601ab432cfa6ff7a" UNIQUE ("userId");


--
-- Name: teams UQ_48c0c32e6247a2de155baeaf980; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE (name);


--
-- Name: players UQ_849acebd2971672e98b7f2a4f05; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "UQ_849acebd2971672e98b7f2a4f05" UNIQUE ("gameAccount");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: players UQ_9d57c365e56acd09d5469228182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "UQ_9d57c365e56acd09d5469228182" UNIQUE (ign);


--
-- Name: team_invites FK_4f2ba52205ec827029da15e95c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "FK_4f2ba52205ec827029da15e95c3" FOREIGN KEY ("playerId") REFERENCES public.players(id);


--
-- Name: activity_logs FK_597e6df96098895bf19d4b5ea45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "FK_597e6df96098895bf19d4b5ea45" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: teams FK_6d5c85d3f2602450d1e615afae9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "FK_6d5c85d3f2602450d1e615afae9" FOREIGN KEY ("leaderId") REFERENCES public.users(id);


--
-- Name: team_invites FK_79cc18d8efe27b7d57df31c187a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "FK_79cc18d8efe27b7d57df31c187a" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- Name: events FK_7b1e7416989fae901b97f08c729; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "FK_7b1e7416989fae901b97f08c729" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- Name: players FK_7c11c744c0601ab432cfa6ff7ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: attendance FK_a7becef9b64f3b028b81cfa2436; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "FK_a7becef9b64f3b028b81cfa2436" FOREIGN KEY ("playerId") REFERENCES public.players(id);


--
-- Name: players FK_ecaf0c4aabc76f1a3d1a91ea33c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_ecaf0c4aabc76f1a3d1a91ea33c" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- Name: attendance FK_f89c5a18dbf866ba8b1e4a9b8e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "FK_f89c5a18dbf866ba8b1e4a9b8e9" FOREIGN KEY ("eventId") REFERENCES public.events(id);


--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

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


ALTER TABLE public.activity_logs_id_seq OWNER TO postgres;

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


ALTER TABLE public.attendance_id_seq OWNER TO postgres;

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
    "teamId" integer,
    description character varying NOT NULL,
    location character varying NOT NULL
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


ALTER TABLE public.events_id_seq OWNER TO postgres;

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


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

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
    "gameAccount" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "roleInGameId" integer,
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


ALTER TABLE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: roles_in_game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_in_game (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.roles_in_game OWNER TO postgres;

--
-- Name: roles_in_game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_in_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_in_game_id_seq OWNER TO postgres;

--
-- Name: roles_in_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_in_game_id_seq OWNED BY public.roles_in_game.id;


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


ALTER TABLE public.team_invites_id_seq OWNER TO postgres;

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


ALTER TABLE public.teams_id_seq OWNER TO postgres;

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
    role_id integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
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


ALTER TABLE public.users_id_seq OWNER TO postgres;

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
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: roles_in_game id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_in_game ALTER COLUMN id SET DEFAULT nextval('public.roles_in_game_id_seq'::regclass);


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
1	create_event	event	29	{"title":"LOL","startTime":"2025-07-16 00:00:00","endTime":"2025-07-17 00:00:00","type":"Thi đấu","teamId":3,"location":"Hà Nội","description":"ada2fwàd"}	2025-07-15 23:01:38.96168	1
2	delete_event	event	29	{"title":"LOL"}	2025-07-15 23:04:38.215032	1
3	update_event	event	28	{"before":{"id":28,"title":"Test Sự kiện sắp diễn ra","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17T05:12:08.947Z","endTime":"2025-07-17T08:12:08.947Z","type":"Luyện tập","note":"Test event upcoming","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Test Sự kiện sắp diễn ra","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2025-07-17 00:00:00","type":"Luyện tập","note":"Test event","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-15 23:10:10.667481	1
4	update_event	event	28	{"before":{"id":28,"title":"Test Sự kiện sắp diễn ra","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2025-07-16T17:00:00.000Z","type":"Luyện tập","note":"Test event","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"Test event","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-15 23:11:28.554588	1
5	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"Test event","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-15 23:11:35.464051	1
6	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:16:43.733931	1
7	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:16:56.17253	1
8	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:20:24.523572	1
9	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:21:13.309551	1
10	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup 1","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:21:23.8241	1
11	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup 1","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Phòng test","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup 1","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z","teamId":1}}	2025-07-16 00:24:39.616535	1
12	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup 1","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z","teamId":3}}	2025-07-16 00:26:14.91391	1
13	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z","teamId":3}}	2025-07-16 00:27:32.309548	1
14	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Luyện tập","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z","teamId":3}}	2025-07-16 00:27:40.293314	1
15	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-16T17:00:00.000Z","endTime":"2053-03-08T17:00:00.000Z","type":"Luyện tập","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":1,"email":"admin@example.com","password":"$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC","refreshToken":null},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-15T05:12:08.947Z","teamId":3}}	2025-07-16 00:27:47.153381	1
16	update_event	event	28	{"before":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":2,"name":"Team Beta","description":"Đội tuyển phụ, chuyên về đào tạo và phát triển tài năng mới.","createdAt":"2025-07-15T04:46:31.466Z","updatedAt":"2025-07-15T04:46:31.466Z"},"createdAt":"2025-07-15T05:12:08.947Z"},"after":{"id":28,"title":"Summer Rift Cup","description":"Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17 00:00:00","endTime":"2053-03-09 00:00:00","type":"Thi đấu","note":"","team":{"id":2,"name":"Team Beta","description":"Đội tuyển phụ, chuyên về đào tạo và phát triển tài năng mới.","createdAt":"2025-07-15T04:46:31.466Z","updatedAt":"2025-07-15T04:46:31.466Z"},"createdAt":"2025-07-15T05:12:08.947Z"}}	2025-07-16 00:38:37.661546	1
17	change_password	user	9	{"userId":9}	2025-07-16 23:33:36.030349	9
18	create_player	player	1	{"fullName":"Trần Thị F","ign":"124f","roleInGame":"ADC","gameAccount":"abcxyz"}	2025-07-17 00:58:42.873035	9
19	create_event	event	30	{"title":"LOL","startTime":"2025-07-18 00:00:00","endTime":"2025-07-19 00:00:00","type":"Thi đấu","teamId":3,"location":"Nhà thi đấu GG Stadium","description":"12fadq"}	2025-07-17 11:53:15.068794	1
20	update_event	event	30	{"before":{"id":30,"title":"LOL","description":"12fadqfà","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-18 00:00:00","endTime":"2025-07-19 00:00:00","type":"Thi đấu","note":null,"team":{"id":3,"name":"Team Gamma","description":"Đội tuyển trẻ, tập trung vào các giải đấu cấp cơ sở.","leader":{"id":4,"email":"leader3@example.com","password":"$2b$10$/27Pa6qMsL.ZO1BbAizbJO/zG24XNcwuMI4AkroXyaROGs1K2zkc.","createdAt":"2025-07-16T05:23:11.881Z"},"createdAt":"2025-07-15T04:46:31.466Z","updatedAt":"2025-07-15T04:46:31.466Z"},"createdAt":"2025-07-17T04:53:15.047Z"},"after":{"id":30,"title":"LOL","description":"12fadqfà","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-18 00:00:00","endTime":"2025-07-19 00:00:00","type":"Thi đấu","note":null,"team":{"id":3,"name":"Team Gamma","description":"Đội tuyển trẻ, tập trung vào các giải đấu cấp cơ sở.","leader":{"id":4,"email":"leader3@example.com","password":"$2b$10$/27Pa6qMsL.ZO1BbAizbJO/zG24XNcwuMI4AkroXyaROGs1K2zkc.","createdAt":"2025-07-16T05:23:11.881Z"},"createdAt":"2025-07-15T04:46:31.466Z","updatedAt":"2025-07-15T04:46:31.466Z"},"createdAt":"2025-07-17T04:53:15.047Z"}}	2025-07-17 11:53:30.442679	1
21	delete_event	event	30	{"title":"LOL"}	2025-07-17 11:53:36.90483	1
22	create_event	event	31	{"title":"dâd fsf","startTime":"2025-07-17T17:00:00.000Z","endTime":"2025-07-18T17:00:00.000Z","type":"Thi đấu","teamId":1,"location":"Nhà thi đấu GG Stadium","description":"414rqdf5"}	2025-07-17 11:54:23.900298	2
23	update_event	event	31	{"before":{"id":31,"title":"dâd fsf","description":"414rqdf5dâd","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17T17:00:00.000Z","endTime":"2025-07-18T17:00:00.000Z","type":"Thi đấu","note":null,"team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":2,"email":"leader@example.com","password":"$2b$10$RdAkzOnNY3lxYlGxZgZTN.K/ETMAzJDxZmPxEd7wko5zo3DS1DlyC","createdAt":"2025-07-16T05:23:11.881Z"},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-17T04:54:23.895Z"},"after":{"id":31,"title":"dâd fsf","description":"414rqdf5dâd","location":"Nhà thi đấu GG Stadium","startTime":"2025-07-17T17:00:00.000Z","endTime":"2025-07-18T17:00:00.000Z","type":"Thi đấu","note":null,"team":{"id":1,"name":"Team Alpha","description":"Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.","leader":{"id":2,"email":"leader@example.com","password":"$2b$10$RdAkzOnNY3lxYlGxZgZTN.K/ETMAzJDxZmPxEd7wko5zo3DS1DlyC","createdAt":"2025-07-16T05:23:11.881Z"},"createdAt":"2025-07-15T04:36:45.229Z","updatedAt":"2025-07-15T04:36:45.229Z"},"createdAt":"2025-07-17T04:54:23.895Z"}}	2025-07-17 11:54:30.969434	2
24	delete_event	event	31	{"title":"dâd fsf"}	2025-07-17 11:54:35.319236	2
25	add_member_to_team	team	1	{"memberId":1,"memberName":"Trần Thị F"}	2025-07-17 13:25:36.631326	2
26	remove_member_from_team	team	1	{"memberId":1}	2025-07-17 13:31:19.398969	2
27	add_member_to_team	team	1	{"memberId":1,"memberName":"Trần Thị F"}	2025-07-17 13:35:59.767227	2
28	remove_member_from_team	team	1	{"memberId":1}	2025-07-17 13:36:11.068463	2
29	accept_invite	team_invite	1	{"teamId":1}	2025-07-17 13:42:36.790397	\N
30	leave_team	team	1	{"teamName":"Team Alpha","userName":"player1@example.com"}	2025-07-17 13:51:11.364837	9
31	accept_invite	team_invite	2	{"teamId":1}	2025-07-17 13:57:36.593007	\N
32	leave_team	team	1	{"teamName":"Team Alpha","userName":"player1@example.com"}	2025-07-17 13:58:35.520967	9
33	accept_invite	team_invite	3	{"teamId":1}	2025-07-17 13:59:58.625509	\N
34	leave_team	team	1	{"teamName":"Team Alpha","userName":"player1@example.com"}	2025-07-17 14:00:05.851002	9
35	accept_invite	team_invite	4	{"teamId":1}	2025-07-17 14:03:13.998909	\N
36	remove_member_from_team	team	1	{"memberId":1}	2025-07-17 14:03:20.653956	2
37	accept_invite	team_invite	5	{"teamId":1}	2025-07-17 14:16:59.492665	\N
38	remove_member_from_team	team	1	{"memberId":1}	2025-07-17 14:17:04.661759	2
39	create_team	team	4	{"name":"Analyst","description":"Phân tích đối thủ","leaderId":12}	2025-07-17 21:51:33.837383	1
40	accept_invite	team_invite	6	{"teamId":4}	2025-07-17 21:57:16.512306	\N
42	accept_invite	team_invite	7	{"teamId":4}	2025-07-17 22:04:34.542495	\N
44	accept_invite	team_invite	8	{"teamId":4}	2025-07-17 22:06:41.448327	\N
46	accept_invite	team_invite	9	{"teamId":4}	2025-07-17 22:19:15.303878	\N
48	accept_invite	team_invite	10	{"teamId":4}	2025-07-17 22:22:18.922882	\N
50	accept_invite	team_invite	11	{"teamId":4}	2025-07-17 22:29:37.07192	\N
52	accept_invite	team_invite	12	{"teamId":4}	2025-07-17 22:31:46.851722	\N
53	leave_team	team	4	{"teamName":"Analyst","userName":"player1@example.com"}	2025-07-17 22:34:41.505821	9
54	delete_user	user	11	{"deletedUser":{"email":"lethong@gmail.com","role":"leader"}}	2025-07-17 22:41:05.002322	1
55	delete_user	user	10	{"deletedUser":{"email":"player2@example.com","role":"leader"}}	2025-07-17 22:41:12.448982	1
56	delete_user	user	12	{"deletedUser":{"email":"lethong1@gmail.com","role":"leader"}}	2025-07-17 22:57:40.636621	1
57	delete_user	user	15	{"deletedUser":{"email":"player3@example.com","role":"player"}}	2025-07-17 23:11:33.95513	1
58	delete_user	user	16	{"deletedUser":{"email":"player4@example.com","role":"player"}}	2025-07-17 23:38:32.174298	1
59	delete_user	user	14	{"deletedUser":{"email":"player2@example.com","role":"player"}}	2025-07-17 23:38:34.383658	1
60	delete_user	user	19	{"deletedUser":{"email":"player4@example.com","role":"player"}}	2025-07-17 23:42:29.64783	1
61	delete_user	user	18	{"deletedUser":{"email":"player3@example.com","role":"player"}}	2025-07-17 23:46:13.448244	1
62	delete_user	user	20	{"deletedUser":{"email":"player3@example.com","role":"player"}}	2025-07-17 23:49:29.88955	1
63	create_player	player	2	{"fullName":"Nguyễn Thị Minh Duyên","ign":"mingzieng","roleInGame":"ADC","gameAccount":"mingzieng"}	2025-07-17 23:57:50.596047	21
64	accept_invite	team_invite	13	{"teamId":1}	2025-07-17 23:59:11.150011	\N
65	create_player	player	3	{"fullName":"Le Van A","ign":"i am a hunter","roleInGame":"Top","gameAccount":"hunter1"}	2025-07-18 00:13:38.659941	17
66	reject_invite	team_invite	14	{"teamId":2}	2025-07-18 00:20:44.609121	\N
67	reject_invite	team_invite	15	{"teamId":2}	2025-07-18 00:24:50.753814	\N
68	accept_invite	team_invite	16	{"teamId":2}	2025-07-18 00:25:03.811642	\N
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, status, note, "createdAt", "updatedAt", "eventId", "playerId") FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, "startTime", "endTime", type, note, "createdAt", "teamId", description, location) FROM stdin;
1	eTeamHub Future Showdown	2024-08-01 09:00:00	2024-08-01 18:00:00	Thi đấu		2025-07-15 11:23:18.012872	1	Giải đấu sắp diễn ra dành cho các đội mới.	Hà Nội
2	eTeamHub Spring Classic	2024-05-01 09:00:00	2024-05-01 18:00:00	Thi đấu		2025-07-15 11:23:58.005081	1	Giải đấu đã kết thúc thành công.	Đà Nẵng
19	Luyện tập chiến thuật mới	2024-08-01 14:00:00	2024-08-01 17:00:00	Luyện tập	Chuẩn bị tài liệu chiến thuật, mang laptop để phân tích video. Tập trung vào kỹ năng teamwork.	2025-07-15 11:46:46.793915	1	Tập luyện các chiến thuật mới cho giải đấu quốc gia sắp tới.	Phòng tập chính - Trung tâm eSports
20	Trận đấu giao hữu với Team Pro	2025-07-15 11:46:46.793915	2025-07-15 14:46:46.793915	Thi đấu	Đang diễn ra sôi nổi, team đang thể hiện tốt. Cần duy trì phong độ.	2025-07-15 11:46:46.793915	1	Đấu giao hữu với đội chuyên nghiệp để test kỹ năng.	Sân thi đấu chính - Trung tâm eSports
21	Buổi tập tuần trước	2024-07-15 09:00:00	2024-07-15 12:00:00	Luyện tập	Đã hoàn thành tốt, team đã cải thiện đáng kể về khả năng phối hợp.	2025-07-15 11:46:46.793915	1	Luyện tập kỹ năng teamwork và giao tiếp trong game.	Phòng tập VIP - Trung tâm eSports
22	Workshop kỹ năng cơ bản	2024-08-05 10:00:00	2024-08-05 16:00:00	Training	Chuẩn bị tài liệu hướng dẫn, đồng phục team. Dành cho thành viên mới.	2025-07-15 11:46:46.793915	2	Buổi workshop dành cho thành viên mới, tập trung vào kỹ năng cơ bản.	Phòng họp A - Trung tâm eSports
23	Giải đấu nội bộ Team Beta	2024-07-25 08:00:00	2024-07-25 18:00:00	Thi đấu	Đã tham gia và đạt kết quả tốt. Học được nhiều kinh nghiệm từ các thành viên khác.	2025-07-15 11:46:46.793915	2	Giải đấu giữa các thành viên trong team để đánh giá trình độ.	Sân thi đấu phụ - Trung tâm eSports
24	Buổi tập cường độ cao	2025-07-15 10:46:46.793915	2025-07-15 13:46:46.793915	Luyện tập	Đang tập trung cao độ, hiệu quả rất tốt. Cần duy trì cường độ này.	2025-07-15 11:46:46.793915	2	Luyện tập với cường độ cao để chuẩn bị cho giải đấu cấp tỉnh.	Phòng tập chuyên dụng - Trung tâm eSports
25	Định hướng cho thành viên mới	2024-08-10 09:00:00	2024-08-10 15:00:00	Training	Chuẩn bị tài liệu giới thiệu, đồng phục team, và các quy định nội bộ. Dành cho thành viên mới.	2025-07-15 11:46:46.793915	3	Buổi định hướng và training cho các thành viên mới gia nhập team.	Phòng họp B - Trung tâm eSports
3	eTeamHub My Upcoming Event	2024-08-10 09:00:00	2024-08-10 18:00:00	Thi đấu		2025-07-15 11:24:09.429954	2	Sự kiện bạn đã tham gia và sắp diễn ra.	Hải Phòng
5	Quick Practice Match	2025-07-15 10:26:04.944415	2025-07-15 13:26:04.944415	Luyện tập	Đang diễn ra sôi nổi, team đang thể hiện tốt	2025-07-15 11:26:04.944415	2	Trận đấu luyện tập nhanh đang diễn ra.	Vũng Tàu
7	Intensive Practice Session	2024-06-20 08:00:00	2024-06-20 18:00:00	Luyện tập	Đã tham gia đầy đủ, hiệu quả rất tốt. Cần duy trì cường độ này	2025-07-15 11:26:33.474426	2	Buổi luyện tập cường độ cao đã tham gia.	Cần Thơ
4	Friendly Match vs Team Alpha	2024-08-15 15:00:00	2024-08-15 18:00:00	Thi đấu	Đây là cơ hội tốt để test kỹ năng. Chuẩn bị tinh thần thi đấu fair play	2025-07-15 11:25:48.933231	3	Trận đấu giao hữu với đội Alpha.	Huế
10	Advanced Team Training	2025-07-15 11:27:12.023487	2025-07-15 14:27:12.023487	Training	Buổi training quan trọng, không được vắng mặt. Chuẩn bị tài liệu trước	2025-07-15 11:27:12.023487	3	Khóa đào tạo nâng cao cho các thành viên mới.	TP. Hồ Chí Minh
6	Strategy Workshop	2024-08-05 13:00:00	2024-08-05 17:00:00	Training	Đã đăng ký tham gia. Chuẩn bị laptop để phân tích video trận đấu	2025-07-15 11:26:15.557356	3	Workshop về chiến thuật và phân tích trận đấu.	Nha Trang
11	Team Practice Session	2024-07-25 14:00:00	2024-07-25 17:00:00	Luyện tập	Mang theo thiết bị cá nhân, chuẩn bị tinh thần tập trung cao độ	2025-07-15 11:27:24.733677	1	Buổi luyện tập kỹ năng teamwork và chiến thuật.	Hà Nội
8	New Member Orientation	2024-07-30 10:00:00	2024-07-30 16:00:00	Training	Chuẩn bị tài liệu giới thiệu, đồng phục team, và các quy định nội bộ	2025-07-15 11:26:44.839887	1	Định hướng và training cho thành viên mới gia nhập.	Hải Phòng
9	Weekly Team Practice	2024-07-15 09:00:00	2024-07-15 12:00:00	Luyện tập	Đã hoàn thành tốt, team đã cải thiện đáng kể về teamwork	2025-07-15 11:26:56.557866	1	Buổi luyện tập hàng tuần đã hoàn thành.	Đà Nẵng
26	Giải đấu cấp cơ sở	2024-08-15 14:00:00	2024-08-15 20:00:00	Thi đấu	Giải đấu quan trọng cho đội trẻ, cần chuẩn bị kỹ lưỡng và tinh thần thi đấu cao.	2025-07-15 11:46:46.793915	3	Tham gia giải đấu cấp cơ sở dành cho các đội trẻ.	Trung tâm thi đấu cơ sở
27	Luyện tập kỹ năng cơ bản	2024-07-20 13:00:00	2024-07-20 16:00:00	Luyện tập	Đã hoàn thành tốt, các thành viên mới đã nắm được kỹ năng cơ bản.	2025-07-15 11:46:46.793915	3	Tập luyện các kỹ năng cơ bản cho thành viên mới.	Phòng tập cơ bản - Trung tâm eSports
28	Summer Rift Cup	2025-07-17 00:00:00	2053-03-09 00:00:00	Thi đấu		2025-07-15 12:12:08.947364	2	Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.	Nhà thi đấu GG Stadium
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, content, "isRead", type, "createdAt", "userId") FROM stdin;
1	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 13:37:49.424264	9
2	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 13:51:23.536636	9
3	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 13:58:42.944193	9
4	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 14:00:13.061026	9
5	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 14:04:36.637369	9
6	Bạn được mời vào team Analyst	f	invite	2025-07-17 21:56:59.37247	9
7	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:04:29.770117	9
8	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:06:36.786882	9
9	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:19:07.143346	9
10	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:22:15.9946	9
11	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:29:32.037171	9
12	Bạn được mời vào team Analyst	f	invite	2025-07-17 22:31:42.578246	9
13	Bạn được mời vào team Team Alpha	f	invite	2025-07-17 23:58:34.240353	21
14	Bạn được mời vào team Team Beta	f	invite	2025-07-18 00:20:06.56691	17
15	Player Le Van A đã từ chối lời mời vào team Team Beta	f	invite	2025-07-18 00:20:44.607054	3
16	Bạn được mời vào team Team Beta	f	invite	2025-07-18 00:23:34.257817	17
17	Player Le Van A đã từ chối lời mời vào team Team Beta	f	invite	2025-07-18 00:24:50.744711	3
18	Bạn được mời vào team Team Beta	f	invite	2025-07-18 00:24:53.167049	17
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, "fullName", ign, "gameAccount", "createdAt", "updatedAt", "roleInGameId", "userId", "teamId") FROM stdin;
1	Trần Thị F	124f	abcxyz	2025-07-17 00:58:42.862736	2025-07-17 22:34:41.497632	4	9	\N
2	Nguyễn Thị Minh Duyên	mingzieng	mingzieng	2025-07-17 23:57:50.591236	2025-07-17 23:59:11.136062	4	21	1
3	Le Van A	i am a hunter	hunter1	2025-07-18 00:13:38.651224	2025-07-18 00:25:03.804487	1	17	2
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	leader
3	player
\.


--
-- Data for Name: roles_in_game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_in_game (id, name) FROM stdin;
1	Top
2	Jungle
3	Mid
4	ADC
5	Support
\.


--
-- Data for Name: team_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_invites (id, status, "createdAt", "updatedAt", "teamId", "playerId") FROM stdin;
1	accepted	2025-07-17 13:37:49.420125	2025-07-17 13:42:36.785788	1	1
2	accepted	2025-07-17 13:51:23.531743	2025-07-17 13:57:36.589542	1	1
3	accepted	2025-07-17 13:58:42.937479	2025-07-17 13:59:58.622283	1	1
4	accepted	2025-07-17 14:00:13.050759	2025-07-17 14:03:13.996186	1	1
5	accepted	2025-07-17 14:04:36.627549	2025-07-17 14:16:59.489618	1	1
6	accepted	2025-07-17 21:56:59.362881	2025-07-17 21:57:16.510954	4	1
7	accepted	2025-07-17 22:04:29.76171	2025-07-17 22:04:34.540978	4	1
8	accepted	2025-07-17 22:06:36.781107	2025-07-17 22:06:41.446251	4	1
9	accepted	2025-07-17 22:19:07.13973	2025-07-17 22:19:15.300965	4	1
10	accepted	2025-07-17 22:22:15.991819	2025-07-17 22:22:18.920221	4	1
11	accepted	2025-07-17 22:29:32.03348	2025-07-17 22:29:37.06967	4	1
12	accepted	2025-07-17 22:31:42.568898	2025-07-17 22:31:46.849895	4	1
13	accepted	2025-07-17 23:58:34.231163	2025-07-17 23:59:11.147767	1	2
14	rejected	2025-07-18 00:20:06.558115	2025-07-18 00:20:44.593074	2	3
15	rejected	2025-07-18 00:23:34.248495	2025-07-18 00:24:50.733893	2	3
16	accepted	2025-07-18 00:24:53.157402	2025-07-18 00:25:03.809463	2	3
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, description, "createdAt", "updatedAt", "leaderId") FROM stdin;
2	Team Beta	Đội tuyển phụ, chuyên về đào tạo và phát triển tài năng mới.	2025-07-15 11:46:31.466234	2025-07-15 11:46:31.466234	3
3	Team Gamma	Đội tuyển trẻ, tập trung vào các giải đấu cấp cơ sở.	2025-07-15 11:46:31.466234	2025-07-15 11:46:31.466234	4
1	Team Alpha	Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.	2025-07-15 11:36:45.229768	2025-07-15 11:36:45.229768	2
4	Analyst	Phân tích đối thủ	2025-07-17 21:51:33.820867	2025-07-17 22:56:00.600587	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role_id, "createdAt") FROM stdin;
1	admin@example.com	$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC	1	2025-07-16 12:23:11.881395
2	leader@example.com	$2b$10$RdAkzOnNY3lxYlGxZgZTN.K/ETMAzJDxZmPxEd7wko5zo3DS1DlyC	2	2025-07-16 12:23:11.881395
3	leader2@example.com	$2b$10$N42GYYnPztYRLRMRevWNyuqmWSyNfOhtqWgRbyx4ttYj8S1jhkxv2	2	2025-07-16 12:23:11.881395
4	leader3@example.com	$2b$10$/27Pa6qMsL.ZO1BbAizbJO/zG24XNcwuMI4AkroXyaROGs1K2zkc.	2	2025-07-16 12:23:11.881395
9	player1@example.com	$2b$10$2Nf1DyomEYysw.wmyjB6E.K1mvoum2GSqOcFH3auF01ny9d/nT.Sq	3	2025-07-16 23:31:04.118914
13	leader1@example.com	$2b$10$Uglex7pKq14temJ5QjQn6usepppjwqd60hvvr0vmGL9ZmLWpX9O/i	2	2025-07-17 22:58:02.654542
17	player2@example.com	$2b$10$YfT0HRwFi0tfMA2L6YCa6ePGLNaeQO744OBiKY3hNMj.dlm6K3hj2	3	2025-07-17 23:38:49.706942
21	player3@example.com	$2b$10$TUxd7zawNBeU3JtbOAGQoOHrdBe7SrQhuWna9TmLjy9mesx0OLJmK	3	2025-07-17 23:56:33.231325
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 68, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 31, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 18, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: roles_in_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_in_game_id_seq', 6, true);


--
-- Name: team_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_invites_id_seq', 16, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


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
-- Name: roles_in_game PK_55c6550732a99bd5a06291317e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_in_game
    ADD CONSTRAINT "PK_55c6550732a99bd5a06291317e9" PRIMARY KEY (id);


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
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


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
    ADD CONSTRAINT "FK_597e6df96098895bf19d4b5ea45" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: teams FK_6d5c85d3f2602450d1e615afae9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "FK_6d5c85d3f2602450d1e615afae9" FOREIGN KEY ("leaderId") REFERENCES public.users(id) ON DELETE SET NULL;


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
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: attendance FK_a7becef9b64f3b028b81cfa2436; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "FK_a7becef9b64f3b028b81cfa2436" FOREIGN KEY ("playerId") REFERENCES public.players(id);


--
-- Name: players FK_e0db292da19b28c3bb61496d2d7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_e0db292da19b28c3bb61496d2d7" FOREIGN KEY ("roleInGameId") REFERENCES public.roles_in_game(id);


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


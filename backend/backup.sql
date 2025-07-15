--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2025-07-15 14:23:18

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
-- TOC entry 231 (class 1259 OID 21133)
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
-- TOC entry 230 (class 1259 OID 21132)
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
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 230
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- TOC entry 221 (class 1259 OID 21073)
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
-- TOC entry 220 (class 1259 OID 21072)
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
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 220
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- TOC entry 223 (class 1259 OID 21085)
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
-- TOC entry 222 (class 1259 OID 21084)
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
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 222
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 233 (class 1259 OID 21143)
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
-- TOC entry 232 (class 1259 OID 21142)
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
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 232
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 229 (class 1259 OID 21116)
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
-- TOC entry 228 (class 1259 OID 21115)
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
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 228
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- TOC entry 215 (class 1259 OID 21041)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 21040)
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
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 227 (class 1259 OID 21109)
-- Name: roles_in_game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_in_game (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.roles_in_game OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 21108)
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
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 226
-- Name: roles_in_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_in_game_id_seq OWNED BY public.roles_in_game.id;


--
-- TOC entry 219 (class 1259 OID 21061)
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
-- TOC entry 218 (class 1259 OID 21060)
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
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 218
-- Name: team_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_invites_id_seq OWNED BY public.team_invites.id;


--
-- TOC entry 225 (class 1259 OID 21096)
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
-- TOC entry 224 (class 1259 OID 21095)
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
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 224
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- TOC entry 217 (class 1259 OID 21050)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "refreshToken" character varying,
    role_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 21049)
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
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3237 (class 2604 OID 21136)
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 21076)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 21088)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 21146)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 21119)
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- TOC entry 3218 (class 2604 OID 21044)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3233 (class 2604 OID 21112)
-- Name: roles_in_game id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_in_game ALTER COLUMN id SET DEFAULT nextval('public.roles_in_game_id_seq'::regclass);


--
-- TOC entry 3220 (class 2604 OID 21064)
-- Name: team_invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites ALTER COLUMN id SET DEFAULT nextval('public.team_invites_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 21099)
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- TOC entry 3219 (class 2604 OID 21053)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3444 (class 0 OID 21133)
-- Dependencies: 231
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, action, "targetType", "targetId", detail, "createdAt", "userId") FROM stdin;
\.


--
-- TOC entry 3434 (class 0 OID 21073)
-- Dependencies: 221
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, status, note, "createdAt", "updatedAt", "eventId", "playerId") FROM stdin;
\.


--
-- TOC entry 3436 (class 0 OID 21085)
-- Dependencies: 223
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
28	Test Sự kiện sắp diễn ra	2025-07-17 12:12:08.947364	2025-07-17 15:12:08.947364	Luyện tập	Test event upcoming	2025-07-15 12:12:08.947364	1	Sự kiện này dùng để test hiển thị trạng thái sắp diễn ra.	Phòng test
\.


--
-- TOC entry 3446 (class 0 OID 21143)
-- Dependencies: 233
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, content, "isRead", type, "createdAt", "userId") FROM stdin;
\.


--
-- TOC entry 3442 (class 0 OID 21116)
-- Dependencies: 229
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, "fullName", ign, "gameAccount", "createdAt", "updatedAt", "roleInGameId", "userId", "teamId") FROM stdin;
\.


--
-- TOC entry 3428 (class 0 OID 21041)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	leader
3	player
\.


--
-- TOC entry 3440 (class 0 OID 21109)
-- Dependencies: 227
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
-- TOC entry 3432 (class 0 OID 21061)
-- Dependencies: 219
-- Data for Name: team_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_invites (id, status, "createdAt", "updatedAt", "teamId", "playerId") FROM stdin;
\.


--
-- TOC entry 3438 (class 0 OID 21096)
-- Dependencies: 225
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, description, "createdAt", "updatedAt", "leaderId") FROM stdin;
1	Team Alpha	Đội tuyển chính của hệ thống, tập trung vào các giải đấu lớn.	2025-07-15 11:36:45.229768	2025-07-15 11:36:45.229768	1
2	Team Beta	Đội tuyển phụ, chuyên về đào tạo và phát triển tài năng mới.	2025-07-15 11:46:31.466234	2025-07-15 11:46:31.466234	3
3	Team Gamma	Đội tuyển trẻ, tập trung vào các giải đấu cấp cơ sở.	2025-07-15 11:46:31.466234	2025-07-15 11:46:31.466234	4
\.


--
-- TOC entry 3430 (class 0 OID 21050)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "refreshToken", role_id) FROM stdin;
1	admin@example.com	$2b$10$qZps8IhgGVtZ8jIdWUolWeDiEExCc3w4CLL5BrohGMNsftgdn4dRC	\N	1
2	leader@example.com	$2b$10$RdAkzOnNY3lxYlGxZgZTN.K/ETMAzJDxZmPxEd7wko5zo3DS1DlyC	\N	2
3	leader2@example.com	$2b$10$N42GYYnPztYRLRMRevWNyuqmWSyNfOhtqWgRbyx4ttYj8S1jhkxv2	\N	2
4	leader3@example.com	$2b$10$/27Pa6qMsL.ZO1BbAizbJO/zG24XNcwuMI4AkroXyaROGs1K2zkc.	\N	2
\.


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 230
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 220
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 222
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 28, true);


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 232
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 228
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 1, false);


--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 226
-- Name: roles_in_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_in_game_id_seq', 5, true);


--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 218
-- Name: team_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_invites_id_seq', 1, false);


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 224
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 3, true);


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3250 (class 2606 OID 21071)
-- Name: team_invites PK_2df756220f694d8f6cf5d0988ec; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "PK_2df756220f694d8f6cf5d0988ec" PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 21094)
-- Name: events PK_40731c7151fe4be3116e45ddf73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 21114)
-- Name: roles_in_game PK_55c6550732a99bd5a06291317e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_in_game
    ADD CONSTRAINT "PK_55c6550732a99bd5a06291317e9" PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 21153)
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 21105)
-- Name: teams PK_7e5523774a38b08a6236d322403; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 21057)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 21048)
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 21125)
-- Name: players PK_de22b8fdeee0c33ab55ae71da3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 21083)
-- Name: attendance PK_ee0ffe42c1f1a01e72b725c0cb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 21141)
-- Name: activity_logs PK_f25287b6140c5ba18d38776a796; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 21131)
-- Name: players REL_7c11c744c0601ab432cfa6ff7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "REL_7c11c744c0601ab432cfa6ff7a" UNIQUE ("userId");


--
-- TOC entry 3258 (class 2606 OID 21107)
-- Name: teams UQ_48c0c32e6247a2de155baeaf980; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE (name);


--
-- TOC entry 3266 (class 2606 OID 21129)
-- Name: players UQ_849acebd2971672e98b7f2a4f05; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "UQ_849acebd2971672e98b7f2a4f05" UNIQUE ("gameAccount");


--
-- TOC entry 3248 (class 2606 OID 21059)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 3268 (class 2606 OID 21127)
-- Name: players UQ_9d57c365e56acd09d5469228182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "UQ_9d57c365e56acd09d5469228182" UNIQUE (ign);


--
-- TOC entry 3274 (class 2606 OID 21164)
-- Name: team_invites FK_4f2ba52205ec827029da15e95c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "FK_4f2ba52205ec827029da15e95c3" FOREIGN KEY ("playerId") REFERENCES public.players(id);


--
-- TOC entry 3283 (class 2606 OID 21204)
-- Name: activity_logs FK_597e6df96098895bf19d4b5ea45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "FK_597e6df96098895bf19d4b5ea45" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 3284 (class 2606 OID 21209)
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 3279 (class 2606 OID 21184)
-- Name: teams FK_6d5c85d3f2602450d1e615afae9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "FK_6d5c85d3f2602450d1e615afae9" FOREIGN KEY ("leaderId") REFERENCES public.users(id);


--
-- TOC entry 3275 (class 2606 OID 21159)
-- Name: team_invites FK_79cc18d8efe27b7d57df31c187a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT "FK_79cc18d8efe27b7d57df31c187a" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- TOC entry 3278 (class 2606 OID 21179)
-- Name: events FK_7b1e7416989fae901b97f08c729; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "FK_7b1e7416989fae901b97f08c729" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- TOC entry 3280 (class 2606 OID 21194)
-- Name: players FK_7c11c744c0601ab432cfa6ff7ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 3273 (class 2606 OID 21154)
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3276 (class 2606 OID 21174)
-- Name: attendance FK_a7becef9b64f3b028b81cfa2436; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "FK_a7becef9b64f3b028b81cfa2436" FOREIGN KEY ("playerId") REFERENCES public.players(id);


--
-- TOC entry 3281 (class 2606 OID 21189)
-- Name: players FK_e0db292da19b28c3bb61496d2d7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_e0db292da19b28c3bb61496d2d7" FOREIGN KEY ("roleInGameId") REFERENCES public.roles_in_game(id);


--
-- TOC entry 3282 (class 2606 OID 21199)
-- Name: players FK_ecaf0c4aabc76f1a3d1a91ea33c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_ecaf0c4aabc76f1a3d1a91ea33c" FOREIGN KEY ("teamId") REFERENCES public.teams(id);


--
-- TOC entry 3277 (class 2606 OID 21169)
-- Name: attendance FK_f89c5a18dbf866ba8b1e4a9b8e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "FK_f89c5a18dbf866ba8b1e4a9b8e9" FOREIGN KEY ("eventId") REFERENCES public.events(id);


-- Completed on 2025-07-15 14:23:18

--
-- PostgreSQL database dump complete
--


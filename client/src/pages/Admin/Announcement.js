import React, { useEffect, useState } from "react";
import { API } from "../../store/utils/API";
// import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/context/LoginContext";
import { notify } from "../../store/utils/helperFunctions";
import { Table, Button, Tag } from "antd";
import { formatDate } from "../../store/utils/helperFunctions";

const Announcement = () => {
  const authCtx = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [ipannouncement, setIpAnnouncement] = useState({
    title: "",
    link: "",
    content: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  console.log(id);

  useEffect(() => {
    if (!id) return;
    setEditMode(true);
  }, [id]);

  useEffect(() => {
    if (!editMode) return;
    if (announcements.length > 0) {
      const announcement = announcements.find(
        (announcement) => announcement._id === id
      );
      if (announcement) {
        setIpAnnouncement({
          title: announcement.title,
          link: announcement.link,
          content: announcement.content,
        });
      }
    }
  }, [editMode, announcements, id]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await API.get("/api/v1/announcement?deleted=true");
        console.log(response.data.data.announcements);
        setAnnouncements(response.data.data.announcements);
      } catch (error) {
        console.error("Error fetching announcements", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/admin/announcement/${record._id}`}>{text}</Link>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      sorter: (a, b) => a.content.localeCompare(b.content),
      width: 400,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => formatDate(text, 3),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "is Deleted",
      dataIndex: "deleted",
      key: "deleted",
      render: (text) =>
        text ? <Tag color="red">Deleted</Tag> : <Tag color="green">Active</Tag>,
      sorter: (a, b) => a.deleted - b.deleted,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          {!record.deleted && (
            <>
              <Button
                type="primary"
                danger
                onClick={() => {
                  // deleteAnnouncement(record._id);
                  navigate(`/admin/announcement?id=${record._id}`);
                }}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  deleteAnnouncement(record._id);
                }}
              >
                Delete
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  const addAnnouncement = async () => {
    if (ipannouncement.title === "" || ipannouncement.content === "") {
      notify("Title and Content are required", "light");
      return;
    }
    try {
      const response = await API.post("/api/v1/announcement", ipannouncement, {
        headers: { Authorization: `Bearer ${authCtx.AccessToken}` },
      });
      console.log(response.data.data.announcement);
      setAnnouncements([...announcements, response.data.data.announcement]);
      notify("Announcement Added Successfully", "light");
      setIpAnnouncement({ title: "", link: "", content: "" });
    } catch (error) {
      console.error("Error adding announcement", error);
      notify("Error adding announcement", "light");
    }
  };
  const updateAnnouncement = async () => {
    if (ipannouncement.title === "" || ipannouncement.content === "") {
      notify("Title and Content are required", "light");
      return;
    }
    try {
      const response = await API.patch(
        `/api/v1/announcement/${id}`,
        ipannouncement,
        {
          headers: { Authorization: `Bearer ${authCtx.AccessToken}` },
        }
      );

      const updatedAnnouncements = announcements.map((announcement) => {
        if (announcement._id === id) {
          return response.data.data.announcement;
        }
        return announcement;
      });

      notify("Announcement Updated Successfully", "light");
      navigate("/admin/announcement");
    } catch (error) {
      console.error("Error updating announcement", error);
      notify("Error updating announcement", "light");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const response = await API.delete(`/api/v1/announcement/${id}`, {
        headers: { Authorization: `Bearer ${authCtx.AccessToken}` },
      });
      notify("Announcement Deleted Successfully", "light");
    } catch (error) {
      console.error("Error deleting announcement", error);
      notify("Error deleting announcement", "light");
    }
  };
  return (
    <div className="flex flex-col justify-center p-4 gap-4">
      <div
        id="addAnnouncement"
        className="flex flex-col gap-2 max-w-96  border-2 border-gray-200 p-4 mb-4 rounded-md"
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="rounded-md p-2 border-2 border-gray-200 "
          value={ipannouncement.title}
          onChange={(e) =>
            setIpAnnouncement({ ...ipannouncement, title: e.target.value })
          }
        />
        <label htmlFor="link">Link</label>
        <input
          type="text"
          id="link"
          name="link"
          className="rounded-md p-2 border-2 border-gray-200 "
          value={ipannouncement.link}
          onChange={(e) =>
            setIpAnnouncement({ ...ipannouncement, link: e.target.value })
          }
        />
        <label htmlFor="content">Content</label>
        <input
          id="content"
          name="content"
          required
          className="rounded-md p-2 border-2 border-gray-200 "
          value={ipannouncement.content}
          onChange={(e) =>
            setIpAnnouncement({ ...ipannouncement, content: e.target.value })
          }
        ></input>
        <Button
          type="primary"
          danger
          onClick={editMode ? updateAnnouncement : addAnnouncement}
        >
          {editMode ? "Update" : "Add"} Announcement
        </Button>
      </div>
      <div id="AllAnnouncement" className="">
        {/*  use antd table */}
        <Table
          columns={columns}
          dataSource={announcements}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 20 }}
        />
      </div>
    </div>
  );
};

export default Announcement;

"use client";
import {
  getAllMessage,
  messageEndpoint,
  updateMessage,
} from "@/app/httpservices/messages";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import Loader from "@/appComponents/pageBlocks/loader";
import Paginator from "@/components/pagination/paginator";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckDouble } from "react-icons/fa6";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useDispatch } from "react-redux";
import { formatDate } from "@/app/utilities/dateFormat";

interface messageProps {
  id: number;
  email: string;
  phone: string;
  body: string;
  date:string;
  messageToReply: number;
  onClick: (val: number) => void;
  responded: boolean;
}
const Page = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Messages"));
  }, [dispatch]);
  const {
    data: messages,
    isLoading,
    error,
  } = useSWR([messageEndpoint], () => getAllMessage());

  const [messageToReply, setMsgToreply] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const lastPage = null;
  const NextPage = null;
  const currentPageLink = NextPage ? NextPage - 1 : lastPage;
  if (messages) {
    const totalPages = Math.ceil(messages?.length / itemsPerPage || 1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = messages?.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
    const handleNextPage = () => {
      if (totalPages > currentPage) {
        setCurrentPage(currentPage + 1);
      }
    };
    return (
      <div className="flex flex-col gap-3 mt-6">
        {currentItems?.length > 0 ? (
          currentItems.map((message: any) => (
            <Message
              email={message?.email}
              phone={message?.phone}
              body={message?.message}
              id={message.id}
              date={message?.createdAt}
              responded={message?.responded}
              messageToReply={messageToReply}
              onClick={setMsgToreply}
              key={message.id}
            />
          ))
        ) : (
          <div className="mt-[10vh] text-sm">
            We have not yet been contacted by someone..
          </div>
        )}
        <div
          className={
            messages?.length > 0 ? "flex justify-end py-4 w-full" : "hidden"
          }
        >
          <Paginator
            activePage={currentPageLink ? currentPageLink : currentPage}
            totalPages={lastPage ? lastPage : totalPages}
            onPageChange={handlePageChange}
            onPreviousPageChange={handlePreviousPage}
            onNextPageChange={handleNextPage}
          />
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection />;
  }
};
export default Page;

const Message = ({
  email,
  phone,
  body,
  date,
  id,
  messageToReply,
  responded,
  onClick,
}: messageProps) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [onWhatsapp, setOnWhatsapp] = useState<boolean>(false);
  const [onEmail, setOnEmail] = useState<boolean>(false);
  const handleSubmitMessage = async (e: any) => {
    try {
      e?.preventDefault();
      if (message == "") {
        toast.error("Type your message!");
      } else {
        setLoading(true);
        if (onEmail) {
          const data = await updateMessage(messageToReply, {
            message: message,
          });
          if (data?.status == 200) {
            toast.success(data.message);
            mutate(messageEndpoint);
            setLoading(false);
            setMessage("");
            router.refresh();
          } else {
            toast.error(data?.message);
            setLoading(false);
          }
        } else {
          const number = phone?.replace(/[^\w\s]/gi, "")?.replace(/ /g, "");
          let url = `https://web.whatsapp.com/send?phone=${number}`;
          url += `&text=${encodeURI(message)}&app_absent=0`;
          await updateMessage(messageToReply, {
            message: message,
          });
          setLoading(false);
          window.open(url);
          console.info(onWhatsapp)
        }
        window.location.reload();
      }
    } catch (err) {
      toast.error("Unexpected issue occurs");
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col bg-white border shadow-sm rounded p-4 md:p-5 border-gray-300 w-full relative">
      <h3 className="text-sm font-medium text-gray-700">{email}</h3>
      <p className="mt-1 text-xs font-medium text-gray-700">
        <span className="font-semibold text-gray-900">Tel: </span>
        {phone}
      </p>
      <p className="mt-2 text-gray-500 text-sm">{body}</p>
      <p className="mt-2 text-gray-500 text-xs">{formatDate(date)}</p>

      <div className="w-full flex justify-end text-sm gap-2">
        {!responded ? (
          <>
            <button
              className={
                email
                  ? "mt-2 inline-flex items-center gap-x-1 text-sm  text-blue-900 disabled:opacity-50"
                  : "hidden"
              }
              onClick={() => {
                onClick(id);
                setOnEmail(true);
                setOnWhatsapp(false);
              }}
            >
              <MdEmail />
              Email Reply
            </button>
            <button
              className={
                phone
                  ? "mt-2 inline-flex items-center gap-x-1 text-sm  text-blue-900 disabled:opacity-50"
                  : "hidden"
              }
              onClick={() => {
                onClick(id);
                setOnWhatsapp(true);
                setOnEmail(false);
              }}
            >
              <FaSquareWhatsapp />
              Whatsapp
            </button>
          </>
        ) : (
          <button
            className="mt-2 inline-flex items-center gap-x-1 text-sm  text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <FaCheckDouble />
            responded
          </button>
        )}
      </div>
      <div
        className={
          messageToReply == id
            ? "w-3/4 absolute top-[40px] z-10 right-1 bg-white shadow rounded p-4 shadow-blue-1"
            : "hidden"
        }
      >
        <h6 className="text-sm text-gray-700 py-2">
          Respond to{" "}
          <span className="font-medium text-gray-400">
            {onEmail ? email : phone}
          </span>
        </h6>
        <textarea
          className="h-[120px] w-full  pl-2 outline-none rounded bg-gray-100 text-black placeholder:text-xs placeholder:p-2 border border-gray-400 text-sm"
          placeholder="Type response here...."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="w-full flex justify-end gap-3">
          <button
            className="mt-2 inline-flex items-center py-1 px-6 rounded text-sm  text-white disabled:opacity-50 bg-red-500"
            onClick={() => onClick(0)}
          >
            cancel
          </button>
          <button
            className="mt-2 inline-flex items-center py-1 px-6 rounded text-sm  text-white disabled:opacity-50 bg-blue-900"
            onClick={handleSubmitMessage}
          >
            {loading ? "sending..." : "send"}
          </button>
        </div>
      </div>
    </div>
  );
};

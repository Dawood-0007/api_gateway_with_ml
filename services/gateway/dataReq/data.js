import express from "express";
import { prisma } from "../lib/prisma.js";

const dataRouter = express.Router();

dataRouter.use(express.json());
dataRouter.use(express.urlencoded({ extended: true }));

dataRouter.get("/dash", async (req, res) => {
  const [
    maliciousCount,
    nonMaliciousCount,
    stats,
    blockedIp,
    result
  ] = await Promise.all([
    prisma.requestLog.count({
      where: { isMalicious: true }
    }),
    prisma.requestLog.count({
      where: { isMalicious: false }
    }),
    prisma.requestLog.aggregate({
      _avg: { anomalyScore: true },
      _count: { _all: true }
    }),
    prisma.blockedIP.count(),
    await prisma.$queryRaw`
        SELECT 
            DATE_TRUNC('hour', "createdAt") AS hour,
            COUNT(*) AS request_count
        FROM "RequestLog"
        WHERE "createdAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY hour
        ORDER BY hour`
  ]);

  res.status(200).json({
    malicious: maliciousCount,
    normal: nonMaliciousCount,
    totalReq: stats._count._all,
    avgAnomaly: stats._avg.anomalyScore,
    totalIpBlocked: blockedIp,
    hourlyReq: result.map(r => ({
      hour: r.hour,
      request_count: Number(r.request_count)
    }))
  });
});

dataRouter.get("/analytics", async (req, res) => {
  try {
    const [
      endpointsCount,
      methodCount,
      ipCount,
      hourlyCount
    ] = await Promise.all([
      prisma.requestLog.groupBy({
        by: ['endpoint'],
        _count: { endpoint: true },
      }),
      prisma.requestLog.groupBy({
        by: ['method'],
        _count: { method: true },
      }),
      prisma.requestLog.groupBy({
        by: ['ip'],
        _count: { ip: true },
      }),
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(
            DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'Asia/Karachi'),
            'HH24:00'
          ) as time,
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE "isMalicious" = true)::int as malicious
        FROM "RequestLog"
        WHERE "createdAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY time
        ORDER BY time;
      `
    ]);

    const hours = [];

    for (let i = 23; i >= 0; i--) {
      const d = new Date();
      d.setHours(d.getHours() - i);

      const hour = d.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        hour12: false
      }) + ":00";

      hours.push({
        time: hour,
        total: 0,
        malicious: 0
      });
    }

    const map = {};

    hourlyCount.forEach(r => {
      map[r.time] = {
        time: r.time,
        total: Number(r.total),
        malicious: Number(r.malicious)
      };
    });


    const result = hours.map(h => map[h.time] || h);
    console.log(result)

    res.status(200).json({
      endpointsCount: endpointsCount.map(e => ({
        endpoint: e.endpoint,
        hit: e._count.endpoint
      })),
      methodCount: methodCount.map(e => ({
        method: e.method,
        hit: e._count.method
      })),
      ipCount: ipCount.map(e => ({
        ip: e.ip,
        hit: e._count.ip
      })),
      hourlyReq: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

dataRouter.post("/block", async (req, res) => {
  const { ip, reason } = req.body;

  try {
    await prisma.blockedIP.create({
      data: {
        ip: ip,
        reason: reason
      }
    });
    res.status(200).json({ message: "IP blocked" })
  } catch (err) {
    res.status(400).send("IP is already blocked");
  }
});

dataRouter.post("/unblock", async (req, res) => {
  const { ip } = req.body;

  try {
    await prisma.blockedIP.delete({
      where: {
        ip: ip
      }
    })
    res.status(200).json({ message: "IP Unblocked" });
  } catch (err) {
    res.status(400).send("IP is already unblocked");
  }
});

dataRouter.get("/blocked", async (req, res) => {
  const [
    ipCount,
    blockedIp
  ] = await Promise.all([
    prisma.requestLog.groupBy({
      by: ['ip'],
      _count: {
        ip: true,
      },
    }),
    prisma.blockedIP.findMany()
  ])

  res.status(200).json({
    blockedIps: blockedIp,
    ipCount: ipCount.map((e) => {
      return { ip: e.ip, hit: e._count.ip }
    }),
  })
});


dataRouter.get("/logs", async (req, res) => {
  const data = await prisma.requestLog.findMany();

  res.status(200).json(data);
});

dataRouter.get("/detection", async (req, res) => {
  const data = await prisma.requestLog.findMany();
  const distribution = {
    "0-0.2": 0,
    "0.3-0.4": 0,
    "0.5-0.6": 0,
    "0.7-0.8": 0,
    "0.9-1.0": 0,
  };

  data.forEach((d) => {
    if (d.anomalyScore <= 0.2) {
      distribution["0-0.2"] += 1
    } else if (d.anomalyScore <= 0.4) {
      distribution["0.3-0.4"] += 1
    } else if (d.anomalyScore <= 0.6) {
      distribution["0.5-0.6"] += 1
    } else if (d.anomalyScore <= 0.8) {
      distribution["0.7-0.8"] += 1
    } else {
      distribution["0.9-1.0"] += 1
    }
  });

  res.status(200).json({ distribution: distribution, requests: data });
});

dataRouter.get("/allUser", async (req, res) => {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastLogin: true
    }
  });

  res.status(200).json(data);
});

dataRouter.get("/hourlyData", async (req, res) => {
  try {
    const hourlyCount = await
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(
            DATE_TRUNC('hour', "createdAt" AT TIME ZONE 'Asia/Karachi'),
            'HH24:00'
          ) as time,
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE "isMalicious" = true)::int as malicious
        FROM "RequestLog"
        WHERE "createdAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY time
        ORDER BY time;
      `

    const hours = [];

    for (let i = 23; i >= 0; i--) {
      const d = new Date();
      d.setHours(d.getHours() - i);

      const hour = d.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        hour12: false
      }) + ":00";

      hours.push({
        time: hour,
        total: 0,
        malicious: 0
      });
    }

    const map = {};

    hourlyCount.forEach(r => {
      map[r.time] = {
        time: r.time,
        total: Number(r.total),
        malicious: Number(r.malicious)
      };
    });


    const result = hours.map(h => map[h.time] || h);

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

dataRouter.post("/unblockIp", async (req, res) => {
  let ip;
  if (req.body) {
    ip = req.body.ip;
  }
  else {
    ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  }
  try {
    await prisma.blockedIP.delete({
      where: {
        ip: ip
      }
    });

    res.status(200).json({ message: "Unbloecked Successfully" })

  } catch (err) {
    console.log(err);
  }
});

dataRouter.get("/checkIp", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const data = await prisma.blockedIP.findUnique({
      where : {
        ip: ip
      }
    });
    if (data) {
      return res.status(200).json({contain: true});
    }
    return res.status(200).json({contain: false});
  } catch (error) {
    console.log(error);
  }
});

export default dataRouter;
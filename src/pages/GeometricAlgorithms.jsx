import React, { useState } from "react";
import { Layout } from "../components";

const GeometricAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Point and Line Operations
  const pointOperations = [
    {
      id: "point-operations",
      name: "Point Operations and Orientation",
      complexity: { time: "O(1)", space: "O(1)" },
      description: "Basic operations on 2D points: distance, orientation, collinearity.",
      code: `struct Point {
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}
    Point operator-(const Point& p) const { return Point(x - p.x, y - p.y); }
    Point operator+(const Point& p) const { return Point(x + p.x, y + p.y); }
    bool operator==(const Point& p) const { return x == p.x && y == p.y; }
};

// Distance between two points
double distance(const Point& p1, const Point& p2) {
    double dx = p1.x - p2.x;
    double dy = p1.y - p2.y;
    return sqrt(dx * dx + dy * dy);
}

// Squared distance (avoids sqrt for comparison)
double distSq(const Point& p1, const Point& p2) {
    double dx = p1.x - p2.x;
    double dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}

// Cross product for orientation
// > 0: counterclockwise, < 0: clockwise, = 0: collinear
double cross(const Point& o, const Point& a, const Point& b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Orientation of three points
int orientation(const Point& p, const Point& q, const Point& r) {
    double val = cross(p, q, r);
    if (abs(val) < 1e-9) return 0;  // collinear
    return val > 0 ? 1 : 2;        // clock or counterclock wise
}

// Check if point q lies on line segment pr
bool onSegment(const Point& p, const Point& q, const Point& r) {
    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
        q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y))
        return true;
    return false;
}

// Check if two line segments intersect
bool doIntersect(const Point& p1, const Point& q1,
                const Point& p2, const Point& q2) {
    int o1 = orientation(p1, q1, p2);
    int o2 = orientation(p1, q1, q2);
    int o3 = orientation(p2, q2, p1);
    int o4 = orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4) return true;

    // Special cases (collinear points on segment)
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false;
}`
    }
  ];

  // Convex Hull Algorithms
  const convexHull = [
    {
      id: "graham-scan",
      name: "Graham Scan",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Find convex hull using sorting and stack-based monotone chain property.",
      code: `// Comparator for polar angle with respect to anchor point
bool polarCompare(const Point& p0, const Point& p1, const Point& p2) {
    int order = orientation(p0, p1, p2);
    if (order == 0) {
        // If collinear, prefer closer point
        return distSq(p0, p1) < distSq(p0, p2);
    }
    return order == 2; // counterclockwise
}

// Graham Scan Algorithm
vector<Point> grahamScan(vector<Point> points) {
    int n = points.size();
    if (n <= 1) return points;

    // Find the bottommost point (and leftmost if tie)
    int minIdx = 0;
    for (int i = 1; i < n; i++) {
        if (points[i].y < points[minIdx].y ||
           (points[i].y == points[minIdx].y && points[i].x < points[minIdx].x)) {
            minIdx = i;
        }
    }

    // Put the bottommost point at first position
    swap(points[0], points[minIdx]);
    Point p0 = points[0];

    // Sort points by polar angle with p0
    sort(points.begin() + 1, points.end(),
         [&](const Point& p1, const Point& p2) {
             return polarCompare(p0, p1, p2);
         });

    // Remove collinear points (keep only farthest)
    int m = 1;
    for (int i = 1; i < n; i++) {
        while (i < n - 1 && orientation(p0, points[i], points[i + 1]) == 0) {
            i++;
        }
        points[m++] = points[i];
    }

    if (m < 2) return {points[0]};

    vector<Point> hull;
    hull.push_back(points[0]);
    hull.push_back(points[1]);

    for (int i = 2; i < m; i++) {
        while (hull.size() >= 2 &&
               orientation(hull[hull.size() - 2], hull.back(), points[i]) != 2) {
            hull.pop_back();
        }
        hull.push_back(points[i]);
    }

    return hull;
}`
    },
    {
      id: "jarvis-march",
      name: "Jarvis March (Gift Wrapping)",
      complexity: { time: "O(n × h)", space: "O(h)" },
      description: "Find convex hull by repeatedly finding the next tangent point.",
      code: `// Find point with minimum x-coordinate (leftmost)
int findLeftmost(const vector<Point>& points) {
    int minIdx = 0;
    for (int i = 1; i < points.size(); i++) {
        if (points[i].x < points[minIdx].x) {
            minIdx = i;
        }
    }
    return minIdx;
}

// Jarvis March Algorithm
vector<Point> jarvisMarch(vector<Point> points) {
    int n = points.size();
    if (n < 3) return points;

    vector<Point> hull;

    // Find leftmost point
    int l = findLeftmost(points);
    int p = l, q;

    do {
        hull.push_back(points[p]);

        q = (p + 1) % n;

        // Find the point q such that orientation(p, i, q) is counterclockwise
        for (int i = 0; i < n; i++) {
            if (orientation(points[p], points[i], points[q]) == 2) {
                q = i;
            }
        }

        p = q;

    } while (p != l);

    return hull;
}`
    }
  ];

  // Line Intersection and Arrangements
  const lineAlgorithms = [
    {
      id: "line-intersection",
      name: "Line Segment Intersection",
      complexity: { time: "O(1)", space: "O(1)" },
      description: "Check if two line segments intersect and find intersection point.",
      code: `// Check if two line segments intersect (already defined above)
// bool doIntersect(Point p1, Point q1, Point p2, Point q2)

// Find intersection point of two lines (not segments)
Point lineIntersection(Point A, Point B, Point C, Point D) {
    // Line AB: A + t(B - A)
    // Line CD: C + s(D - C)

    Point AB = B - A;
    Point CD = D - C;
    Point AC = C - A;

    double denominator = AB.x * CD.y - AB.y * CD.x;

    if (abs(denominator) < 1e-9) {
        // Lines are parallel
        return Point(1e9, 1e9); // No intersection
    }

    double t = (AC.x * CD.y - AC.y * CD.x) / denominator;

    return Point(A.x + t * AB.x, A.y + t * AB.y);
}

// Check if point is on line segment
bool pointOnSegment(Point p, Point q, Point r) {
    return onSegment(p, q, r);
}

// Distance from point to line
double pointToLineDistance(Point p, Point a, Point b) {
    // Line: ax + by + c = 0
    double A = b.y - a.y;
    double B = a.x - b.x;
    double C = a.y * (a.x - b.x) - a.x * (a.y - b.y);

    return abs(A * p.x + B * p.y + C) / sqrt(A * A + B * B);
}`
    },
    {
      id: "convex-polygon",
      name: "Convex Polygon Properties",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Properties and algorithms for convex polygons.",
      code: `// Check if polygon is convex
bool isConvex(vector<Point>& polygon) {
    int n = polygon.size();
    if (n < 3) return false;

    bool isClockwise = false;
    bool first = true;

    for (int i = 0; i < n; i++) {
        Point a = polygon[i];
        Point b = polygon[(i + 1) % n];
        Point c = polygon[(i + 2) % n];

        int orient = orientation(a, b, c);

        if (orient != 0) {
            if (first) {
                isClockwise = (orient == 1);
                first = false;
            } else if (isClockwise != (orient == 1)) {
                return false;
            }
        }
    }

    return true;
}

// Check if point is inside convex polygon
bool pointInConvexPolygon(Point p, vector<Point>& polygon) {
    int n = polygon.size();

    // Check if point is on correct side of all edges
    for (int i = 0; i < n; i++) {
        Point a = polygon[i];
        Point b = polygon[(i + 1) % n];

        // Point should be on the left side of directed edge a->b
        if (orientation(a, b, p) == 1) { // clockwise
            return false;
        }
    }

    return true;
}

// Polygon area using shoelace formula
double polygonArea(vector<Point>& polygon) {
    int n = polygon.size();
    double area = 0;

    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        area += polygon[i].x * polygon[j].y;
        area -= polygon[j].x * polygon[i].y;
    }

    return abs(area) / 2.0;
}

// Centroid of polygon
Point polygonCentroid(vector<Point>& polygon) {
    int n = polygon.size();
    double cx = 0, cy = 0, area = 0;

    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        double cross = polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
        area += cross;
        cx += (polygon[i].x + polygon[j].x) * cross;
        cy += (polygon[i].y + polygon[j].y) * cross;
    }

    area /= 2.0;
    cx /= (6.0 * area);
    cy /= (6.0 * area);

    return Point(cx, cy);
}`
    }
  ];

  // Geometric Search and Closest Points
  const geometricSearch = [
    {
      id: "closest-pair",
      name: "Closest Pair of Points",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Find the minimum distance between any two points in a set.",
      code: `// Brute force O(n²)
double bruteForceClosest(vector<Point>& points) {
    double minDist = 1e9;
    int n = points.size();

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            minDist = min(minDist, distance(points[i], points[j]));
        }
    }

    return minDist;
}

// Divide and conquer O(n log n)
double closestUtil(vector<Point>& points, int left, int right) {
    if (right - left <= 3) {
        return bruteForceClosest(vector<Point>(points.begin() + left,
                                             points.begin() + right + 1));
    }

    int mid = left + (right - left) / 2;
    Point midPoint = points[mid];

    double dl = closestUtil(points, left, mid);
    double dr = closestUtil(points, mid + 1, right);
    double d = min(dl, dr);

    // Check strip around dividing line
    vector<Point> strip;
    for (int i = left; i <= right; i++) {
        if (abs(points[i].x - midPoint.x) < d) {
            strip.push_back(points[i]);
        }
    }

    // Sort strip by y-coordinate
    sort(strip.begin(), strip.end(),
         [](const Point& a, const Point& b) { return a.y < b.y; });

    // Check points in strip
    for (int i = 0; i < strip.size(); i++) {
        for (int j = i + 1; j < strip.size() && (strip[j].y - strip[i].y) < d; j++) {
            d = min(d, distance(strip[i], strip[j]));
        }
    }

    return d;
}

double closestPair(vector<Point> points) {
    sort(points.begin(), points.end(),
         [](const Point& a, const Point& b) { return a.x < b.x; });

    return closestUtil(points, 0, points.size() - 1);
}`
    },
    {
      id: "point-in-polygon",
      name: "Point in Polygon",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Determine if a point lies inside, outside, or on the boundary of a polygon.",
      code: `// Ray casting algorithm
bool pointInPolygon(Point p, vector<Point>& polygon) {
    int n = polygon.size();
    bool inside = false;

    for (int i = 0, j = n - 1; i < n; j = i++) {
        Point a = polygon[i], b = polygon[j];

        // Check if point is on edge
        if (onSegment(a, p, b)) return true;

        // Check if ray crosses edge
        if ((a.y > p.y) != (b.y > p.y) &&
            (p.x < a.x + (b.x - a.x) * (p.y - a.y) / (b.y - a.y))) {
            inside = !inside;
        }
    }

    return inside;
}

// Winding number algorithm (handles non-simple polygons)
int windingNumber(Point p, vector<Point>& polygon) {
    int n = polygon.size();
    double wn = 0;

    for (int i = 0; i < n; i++) {
        Point a = polygon[i], b = polygon[(i + 1) % n];

        if (a.y <= p.y) {
            if (b.y > p.y && cross(a, b, p) > 0) wn++;
        } else {
            if (b.y <= p.y && cross(a, b, p) < 0) wn--;
        }
    }

    return wn;
}

bool pointInPolygonWinding(Point p, vector<Point>& polygon) {
    return windingNumber(p, polygon) != 0;
}`
    }
  ];

  // Computational Geometry Algorithms
  const computationalGeometry = [
    {
      id: "delaunay-triangulation",
      name: "Delaunay Triangulation",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Create triangulation where no point lies inside the circumcircle of any triangle.",
      code: `// Bowyer-Watson algorithm for Delaunay triangulation
class DelaunayTriangulation {
private:
    struct Triangle {
        Point a, b, c;
        Triangle(Point a, Point b, Point c) : a(a), b(b), c(c) {}
    };

    vector<Triangle> triangles;

    // Circumcircle test
    bool inCircumcircle(Point p, Triangle t) {
        Point a = t.a, b = t.b, c = t.c;

        double ax = a.x - p.x, ay = a.y - p.y;
        double bx = b.x - p.x, by = b.y - p.y;
        double cx = c.x - p.x, cy = c.y - p.y;

        double det = ax * (by * cx * cx + cy * cy - bx * cx - by * cy) -
                    ay * (bx * cx * cx + by * cy * cy - bx * bx * cx - by * by * cy) +
                    ax * ax * (by * cx - bx * cy) + ay * ay * (bx * cx - by * cx);

        return det > 0;
    }

public:
    vector<Triangle> triangulate(vector<Point>& points) {
        // Start with super triangle
        double minX = points[0].x, maxX = points[0].x;
        double minY = points[0].y, maxY = points[0].y;

        for (auto& p : points) {
            minX = min(minX, p.x); maxX = max(maxX, p.x);
            minY = min(minY, p.y); maxY = max(maxY, p.y);
        }

        double dx = maxX - minX, dy = maxY - minY;
        double dmax = max(dx, dy);
        double midx = (minX + maxX) / 2, midy = (minY + maxY) / 2;

        Point p1(midx - 20 * dmax, midy - dmax);
        Point p2(midx, midy + 20 * dmax);
        Point p3(midx + 20 * dmax, midy - dmax);

        triangles = {Triangle(p1, p2, p3)};

        // Add points one by one
        for (auto& p : points) {
            vector<Triangle> badTriangles;
            vector<pair<Point, Point>> polygon;

            // Find bad triangles
            for (auto& t : triangles) {
                if (inCircumcircle(p, t)) {
                    badTriangles.push_back(t);
                }
            }

            // Find boundary of polygonal hole
            // Implementation would continue with edge finding...
        }

        return triangles;
    }
};`
    },
    {
      id: "voronoi-diagram",
      name: "Voronoi Diagram",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Partition plane into regions closest to each point.",
      code: `// Fortune's algorithm or divide and conquer approach
class VoronoiDiagram {
private:
    struct Edge {
        Point start, end;
        Edge(Point s, Point e) : start(s), end(e) {}
    };

    vector<Edge> edges;

public:
    // Simplified implementation - actual Voronoi is complex
    vector<Edge> computeVoronoi(vector<Point>& points) {
        // Sort points
        sort(points.begin(), points.end(),
             [](const Point& a, const Point& b) {
                 return a.x < b.x || (a.x == b.x && a.y < b.y);
             });

        // For each pair of points, find perpendicular bisector
        for (size_t i = 0; i < points.size(); i++) {
            for (size_t j = i + 1; j < points.size(); j++) {
                Point mid((points[i].x + points[j].x) / 2,
                         (points[i].y + points[j].y) / 2);

                // Direction vector
                Point dir(points[j].x - points[i].x, points[j].y - points[i].y);

                // Perpendicular direction
                Point perpDir(-dir.y, dir.x);

                // Create edge segment (simplified)
                Point start(mid.x - perpDir.x, mid.y - perpDir.y);
                Point end(mid.x + perpDir.x, mid.y + perpDir.y);

                edges.push_back(Edge(start, end));
            }
        }

        return edges;
    }
};`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Max Points on a Line",
      difficulty: "Hard",
      description: "Find maximum number of points that lie on the same straight line",
      hint: "For each point, calculate slopes with other points"
    },
    {
      name: "Rectangle Area",
      difficulty: "Medium",
      description: "Compute area of two rectangles' union",
      hint: "Calculate overlap area and subtract from sum"
    },
    {
      name: "Number of Boomerangs",
      difficulty: "Easy",
      description: "Count number of boomerang triplets",
      hint: "For each point, count distances to other points"
    },
    {
      name: "Valid Triangle Number",
      difficulty: "Medium",
      description: "Count number of triplets that form valid triangles",
      hint: "Sort array and use two pointers"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(1)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(n)") && !complexity.includes("n log")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("n log n")) color = "bg-yellow-100 text-yellow-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {complexity}
      </span>
    );
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Geometric Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master algorithms for solving geometric problems involving points, lines, polygons, and computational geometry.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("points")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "points"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Point Operations
            </button>
            <button
              onClick={() => setActiveSection("convex-hull")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "convex-hull"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Convex Hull
            </button>
            <button
              onClick={() => setActiveSection("lines")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "lines"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Line Algorithms
            </button>
            <button
              onClick={() => setActiveSection("search")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "search"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Geometric Search
            </button>
            <button
              onClick={() => setActiveSection("computational")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "computational"
                  ? "bg-indigo-600 text-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
            >
              Computational
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Geometric Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">What are Geometric Algorithms?</h3>
                  <p className="text-gray-600 mb-6">
                    Geometric algorithms deal with problems involving geometric objects like points,
                    lines, polygons, and shapes. They solve real-world problems in computer graphics,
                    GIS systems, robotics, computer vision, and computational geometry.
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Key Concepts</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">📍</span>
                      <span><strong>Points & Coordinates:</strong> 2D/3D point representations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">📏</span>
                      <span><strong>Distance & Orientation:</strong> Euclidean distance, cross products</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">🔺</span>
                      <span><strong>Convex Hull:</strong> Smallest convex set containing all points</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">📐</span>
                      <span><strong>Line Arrangements:</strong> Intersections, arrangements</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Algorithm Categories</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Basic Operations</h4>
                      <p className="text-gray-600">Point operations, line intersections, orientation tests</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Shape Analysis</h4>
                      <p className="text-gray-600">Convex hull, polygon properties, area calculations</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Geometric Search</h4>
                      <p className="text-gray-600">Closest points, point location, range queries</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Advanced Geometry</h4>
                      <p className="text-gray-600">Triangulation, Voronoi diagrams, arrangements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br bg-amber-50 border border-amber-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-3">Time Complexity</h4>
                  <p className="text-gray-600">Often O(n log n)</p>
                  <p className="text-sm text-gray-500 mt-2">Convex hull, closest pairs</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-600">O(n) for most algorithms</p>
                  <p className="text-sm text-gray-500 mt-2">Points and geometric structures</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Key Techniques</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Orientation tests</li>
                    <li>• Cross products</li>
                    <li>• Sweep line</li>
                    <li>• Divide and conquer</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Point Operations Section */}
          {activeSection === "points" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Point Operations</h2>

              <div className="grid grid-cols-1 gap-8">
                {pointOperations.map((operation) => (
                  <div
                    key={operation.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{operation.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${operation.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${operation.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{operation.description}</p>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-600 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Convex Hull Section */}
          {activeSection === "convex-hull" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Convex Hull Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {convexHull.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${algorithm.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${algorithm.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-600 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line Algorithms Section */}
          {activeSection === "lines" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Line and Polygon Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {lineAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${algorithm.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${algorithm.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-600 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Geometric Search Section */}
          {activeSection === "search" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Geometric Search Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {geometricSearch.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${algorithm.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${algorithm.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-600 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Computational Geometry Section */}
          {activeSection === "computational" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced Computational Geometry</h2>

              <div className="grid grid-cols-1 gap-8">
                {computationalGeometry.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${algorithm.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${algorithm.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-600 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br white rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-indigo-300 hover:shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Geometry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Distance Between Points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Points on Same Line</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Rectangle Overlap</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Valid Triangle</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Geometry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Line Segment Intersection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Convex Hull (Graham Scan)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Point in Polygon</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Closest Pair of Points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Rectangle Area Intersection</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Geometry</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Max Points on a Line</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Perfect Rectangle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Erect the Fence (Convex Hull)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Number of Boomerangs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Minimum Area Rectangle</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewProblems.map((problem, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyan-400 font-semibold">{problem.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                        }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{problem.description}</p>
                    <p className="text-xs text-gray-500 italic">{problem.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geometric Algorithms Cheat Sheet */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-indigo-300 hover:shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Geometric Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Orientation Tests</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded">
                    <span className="text-gray-600">Cross Product 0:</span>
                    <span className="text-green-400 font-mono">Counterclockwise</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded">
                    <span className="text-gray-600">Cross Product &lt; 0:</span>
                    <span className="text-red-400 font-mono">Clockwise</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded">
                    <span className="text-gray-600">Cross Product = 0:</span>
                    <span className="text-blue-400 font-mono">Collinear</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded">
                    <span className="text-gray-600">Distance Formula:</span>
                    <span className="text-purple-400 font-mono">√((x2-x1)² + (y2-y1)²)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Algorithm Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white border border-gray-200 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Convex Hull:</div>
                    <div className="text-gray-500">Graham Scan: O(n log n), Jarvis: O(n × h)</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Closest Pair:</div>
                    <div className="text-gray-500">Divide & Conquer: O(n log n)</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Line Intersection:</div>
                    <div className="text-gray-500">O(1) per pair, O(n²) naive</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Point in Polygon:</div>
                    <div className="text-gray-500">Ray casting: O(n)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeometricAlgorithms;


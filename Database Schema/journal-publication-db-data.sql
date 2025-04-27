-- Optimized insert data into the journals table
INSERT INTO journals (journal_name, eissn_id, publication_type, impact_factor, publication_frequency, acceptance_rate) 
VALUES 
('Botanical Research Journal', '1234-5678', 'Research', 3.5, 'Monthly', 30),
('Plant Science Today', '2345-6789', 'Review', 4.0, 'Quarterly', 25),
('Journal of Environmental Biology', '3456-7890', 'Research', 2.8, 'Bi-Monthly', 40),
('Agricultural Innovation Journal', '4567-8901', 'Research', 4.2, 'Monthly', 35),
('International Journal of Botany', '5678-9012', 'Review', 5.0, 'Annually', 20),
('Plant Diversity and Conservation', '6789-0123', 'Research', 3.2, 'Quarterly', 30),
('Journal of Plant Pathology', '7890-1234', 'Research', 3.7, 'Bi-Monthly', 50),
('Global Plant Studies', '8901-2345', 'Research', 2.5, 'Monthly', 40),
('Journal of Horticulture Science', '9012-3456', 'Research', 3.1, 'Monthly', 33),
('Plant Biotechnology Review', '0123-4567', 'Review', 4.8, 'Annually', 15),
('Forest Ecology and Management', '2345-6789', 'Research', 4.0, 'Quarterly', 28),
('Plant Ecology Journal', '3456-7890', 'Research', 3.9, 'Bi-Monthly', 42),
('Marine Plant Science', '4567-8901', 'Research', 2.7, 'Monthly', 37),
('Crop Science Journal', '5678-9012', 'Research', 3.6, 'Quarterly', 45),
('Tropical Plant Research', '6789-0123', 'Research', 4.1, 'Monthly', 30),
('Plant Genetics and Genomics', '7890-1234', 'Review', 4.3, 'Annually', 18),
('Botany and Sustainability', '8901-2345', 'Research', 3.0, 'Quarterly', 38),
('International Journal of Plant Physiology', '9012-3456', 'Research', 3.4, 'Bi-Monthly', 43),
('Journal of Agricultural Biotechnology', '0123-4567', 'Review', 5.2, 'Annually', 12),
('Ecology and Evolutionary Biology Journal', '1234-5678', 'Research', 4.5, 'Monthly', 36),
('Fungal Plant Diseases Journal', '2345-6789', 'Research', 2.9, 'Bi-Monthly', 55),
('Plant Molecular Biology Journal', '3456-7890', 'Research', 3.8, 'Quarterly', 34);


-- Optimized insert data into the issues table
INSERT INTO issues (journal_id, vol_issue, publish_date) 
VALUES 
    (1, 'Vol1Issue01', DATE '2024-01-15'),
    (1, 'Vol1Issue02', DATE '2024-02-15'),
    (2, 'Vol2Issue01', DATE '2024-01-20'),
    (3, 'Vol1Issue01', DATE '2024-03-10'),
    (4, 'Vol5Issue01', DATE '2024-04-05'),
    (5, 'Vol3Issue02', DATE '2024-02-25'),
    (6, 'Vol4Issue01', DATE '2024-01-30'),
    (7, 'Vol2Issue01', DATE '2024-03-18'),
    (8, 'Vol6Issue03', DATE '2024-04-01'),
    (9, 'Vol8Issue02', DATE '2024-02-05'),
    (10, 'Vol1Issue01', DATE '2024-01-18'),
    (11, 'Vol2Issue02', DATE '2024-02-28'),
    (12, 'Vol9Issue01', DATE '2024-03-22'),
    (13, 'Vol7Issue01', DATE '2024-01-10'),
    (14, 'Vol3Issue01', DATE '2024-04-20'),
    (15, 'Vol5Issue02', DATE '2024-02-14'),
    (16, 'Vol6Issue01', DATE '2024-03-25'),
    (17, 'Vol2Issue02', DATE '2024-01-15'),
    (18, 'Vol3Issue03', DATE '2024-04-01'),
    (19, 'Vol4Issue01', DATE '2024-03-30'),
    (20, 'Vol1Issue01', DATE '2024-01-22');


-- Optimized insert data into the announcements table
INSERT INTO announcements (journal_id, topic, announcement, announce_date) 
VALUES 
    (1, 'Call for Papers', 'We are inviting submissions for the upcoming issues of the journal.', DATE '2024-01-15'),
    (2, 'New Editorial Board', 'The editorial board of the journal has been updated. Visit our website for more details.', DATE '2024-02-01'),
    (3, 'Conference Announcement', 'The journal will be sponsoring a conference on botany in the coming months.', DATE '2024-03-10'),
    (4, 'Special Issue on Marine Biology', 'We are calling for research articles for a special issue on Marine Biology.', DATE '2024-01-20'),
    (5, 'Annual Review Submission', 'Submit your research articles for the annual review of plant pathology.', DATE '2024-04-05'),
    (6, 'New Partnerships', 'We have formed new partnerships with research institutions for better collaborations.', DATE '2024-03-15'),
    (7, 'Online Submission System', 'We have upgraded our online submission system. Please read the guidelines.', DATE '2024-02-22'),
    (8, 'Call for Special Issue', 'We are looking for submissions on the impact of climate change on botany.', DATE '2024-03-01'),
    (9, 'New Issue Released', 'The latest issue of Tropical Plant Studies has been released and is now available online.', DATE '2024-02-05'),
    (10, 'Journal Milestone', 'We are celebrating our 10th year in publishing. Join us in celebrating this achievement!', DATE '2024-03-22'),
    (11, 'New Article Format', 'We have changed our article formatting guidelines. Please ensure compliance when submitting.', DATE '2024-01-18'),
    (12, 'Annual Call for Papers', 'We are now accepting submissions for our upcoming annual issue. Deadline: 2024-05-01.', DATE '2024-04-01'),
    (13, 'Collaboration with Universities', 'We have partnered with universities to fund research in botany.', DATE '2024-02-28'),
    (14, 'Research Highlight', 'Check out our special feature on recent research in plant genetics.', DATE '2024-03-10'),
    (15, 'New Editor Appointment', 'We are excited to announce the appointment of a new senior editor for our journal.', DATE '2024-02-12'),
    (16, 'Expanded Review Section', 'We are now accepting submissions for the new review section of the journal.', DATE '2024-01-25'),
    (17, 'Student Submissions Open', 'We are encouraging students to submit their work for publication in our journal.', DATE '2024-03-05'),
    (18, 'Partnership with Research Labs', 'Our journal has partnered with major research labs for plant studies.', DATE '2024-02-18'),
    (19, 'Revised Submission Guidelines', 'We have updated our submission guidelines. Please visit our website for details.', DATE '2024-04-01'),
    (20, 'International Collaboration', 'We are collaborating with international institutions to enhance research coverage.', DATE '2024-03-18');


-- Optimized insert data into the authors table
INSERT INTO authors (first_name, last_name, gender, date_of_birth, email, phone, profession, institute, country, address) 
VALUES 
    ('John', 'Doe', 'Male', DATE '1980-05-15', 'john.doe@example.com', '123-456-7890', 'Botanist', 'University of Nature', 'USA', '123 Green St.'),
    ('Jane', 'Smith', 'Female', DATE '1985-08-20', 'jane.smith@example.com', '987-654-3210', 'Ecologist', 'Nature Conservancy', 'UK', '456 Oak Rd.'),
    ('David', 'Johnson', 'Male', DATE '1990-03-12', 'david.johnson@example.com', '456-789-1230', 'Plant Geneticist', 'Plant Institute', 'Canada', '789 Birch Ln.'),
    ('Emily', 'White', 'Female', DATE '1978-11-30', 'emily.white@example.com', '321-654-9870', 'Botany Professor', 'Green University', 'Australia', '123 Maple Ave.'),
    ('Michael', 'Brown', 'Male', DATE '1992-06-25', 'michael.brown@example.com', '654-321-7890', 'Plant Researcher', 'Research Corp', 'Germany', '456 Pine Rd.'),
    ('Anna', 'Williams', 'Female', DATE '1988-09-15', 'anna.williams@example.com', '987-321-6540', 'Plant Physiologist', 'Nature Labs', 'USA', '101 Elm St.'),
    ('William', 'Davis', 'Male', DATE '1995-02-10', 'william.davis@example.com', '345-678-9012', 'Agronomist', 'Eco Institute', 'Canada', '202 Cedar Dr.'),
    ('Sophia', 'Martinez', 'Female', DATE '1987-01-22', 'sophia.martinez@example.com', '567-890-1234', 'Environmental Scientist', 'Eco Research', 'Spain', '303 Fir St.'),
    ('James', 'Garcia', 'Male', DATE '1983-04-17', 'james.garcia@example.com', '234-567-8901', 'Agricultural Researcher', 'AgriTech', 'Mexico', '404 Walnut Ln.'),
    ('Olivia', 'Wilson', 'Female', DATE '1994-12-01', 'olivia.wilson@example.com', '876-543-2109', 'Research Scientist', 'Plant Solutions', 'UK', '505 Birch Ave.'),
    ('Lucas', 'Taylor', 'Male', DATE '1982-03-10', 'lucas.taylor@example.com', '213-546-8790', 'Ecologist', 'Eco Institute', 'USA', '678 Ash Ln.'),
    ('Isabella', 'Lopez', 'Female', DATE '1993-07-25', 'isabella.lopez@example.com', '789-012-3456', 'Environmental Biologist', 'Nature Works', 'Mexico', '789 Maple Ct.'),
    ('Liam', 'Anderson', 'Male', DATE '1989-06-14', 'liam.anderson@example.com', '432-109-8765', 'Botanist', 'Eco Research', 'Canada', '123 Willow St.'),
    ('Ava', 'Nguyen', 'Female', DATE '1984-08-09', 'ava.nguyen@example.com', '567-890-4321', 'Plant Ecologist', 'Green Labs', 'Vietnam', '234 Banyan Rd.'),
    ('Ethan', 'Miller', 'Male', DATE '1977-01-18', 'ethan.miller@example.com', '678-123-4567', 'Forestry Expert', 'Forest Conservation', 'Australia', '567 Eucalyptus Blvd.'),
    ('Mia', 'Gonzalez', 'Female', DATE '1991-10-30', 'mia.gonzalez@example.com', '890-123-4567', 'Plant Pathologist', 'Nature Care', 'Spain', '890 Cypress Dr.'),
    ('Noah', 'Harris', 'Male', DATE '1985-11-05', 'noah.harris@example.com', '345-678-2345', 'Agricultural Engineer', 'Agri Innovations', 'USA', '456 Sequoia Ave.'),
    ('Emma', 'Clark', 'Female', DATE '1986-04-23', 'emma.clark@example.com', '543-210-8765', 'Plant Biotechnologist', 'BioTech Labs', 'Germany', '678 Magnolia St.'),
    ('Benjamin', 'Scott', 'Male', DATE '1992-02-14', 'benjamin.scott@example.com', '765-432-1098', 'Forest Ecologist', 'EcoForests', 'UK', '890 Redwood Dr.'),
    ('Charlotte', 'Kim', 'Female', DATE '1987-09-07', 'charlotte.kim@example.com', '678-987-5432', 'Plant Molecular Biologist', 'Green Genetics', 'South Korea', '234 Juniper Way');


-- Optimized insert data into the editorial table
INSERT INTO editorial (journal_id, user_id, category) 
VALUES 
    (1, 1, 'Editor'),
    (1, 2, 'Reviewer'),
    (1, 3, 'Associate Editor'),
    (2, 4, 'Editor'),
    (2, 5, 'Reviewer'),
    (2, 6, 'Editorial Assistant'),
    (3, 7, 'Editor'),
    (3, 8, 'Reviewer'),
    (3, 9, 'Associate Editor'),
    (4, 10, 'Editor'),
    (4, 11, 'Reviewer'),
    (4, 12, 'Editorial Assistant'),
    (5, 13, 'Editor'),
    (5, 14, 'Reviewer'),
    (5, 15, 'Associate Editor'),
    (6, 16, 'Editor'),
    (6, 17, 'Reviewer'),
    (6, 18, 'Editorial Assistant'),
    (7, 19, 'Editor'),
    (7, 20, 'Reviewer'),
    (8, 1, 'Associate Editor'),
    (8, 2, 'Reviewer'),
    (9, 3, 'Editor'),
    (9, 4, 'Reviewer'),
    (10, 5, 'Associate Editor');


-- Optimized insert data into the articles table
INSERT INTO articles (
    journal_id, 
    vol_issue, 
    article_title, 
    abstract, 
    article_type, 
    keywords, 
    doi_id, 
    author,
    corresponding_author,
    published_date
) 
VALUES 
    (1, 'Vol1Issue01', 'Botanical Insights on Climate Change', 'This article discusses the effects of climate change on plant species.', 'Research', 'Climate change, Plant species', '10.1234/bioclim01', 1, 2, DATE '2024-01-15'),
    (1, 'Vol1Issue02', 'Pollution and Plant Growth', 'A study of pollution impacts on plant health and growth rates.', 'Research', 'Pollution, Plant health', '10.1234/biopollution01', 3, 4, DATE '2024-02-15'),
    (2, 'Vol2Issue01', 'Genetic Modifications in Plants', 'Examining the future of genetically modified plants in agriculture.', 'Review', 'Genetic modification, Agriculture', '10.1234/plantgenmod01', 5, 6, DATE '2024-03-10'),
    (3, 'Vol1Issue01', 'Ecological Balance and Invasive Species', 'This research focuses on how invasive species affect ecological balance.', 'Research', 'Invasive species, Ecology', '10.1234/ecoinv01', 7, 8, DATE '2024-04-05'),
    (4, 'Vol5Issue01', 'Marine Flora Diversity in Tropical Oceans', 'A comprehensive study on the diverse marine flora in tropical regions.', 'Research', 'Marine flora, Diversity', '10.1234/marfloradiv01', 9, 10, DATE '2024-01-20'),
    (5, 'Vol3Issue02', 'New Approaches in Plant Pathology', 'Recent advancements in the study of plant diseases and treatments.', 'Research', 'Plant pathology, Disease control', '10.1234/plantpath01', 11, 12, DATE '2024-02-25'),
    (6, 'Vol4Issue01', 'Microbial Interactions in Plant Roots', 'Exploring the microbial ecosystem within plant root systems.', 'Research', 'Microbial interactions, Plant roots', '10.1234/microplantroot01', 13, 14, DATE '2024-01-30'),
    (7, 'Vol2Issue01', 'Plant Growth Regulators in Horticulture', 'The role of plant growth regulators in the field of horticulture.', 'Research', 'Growth regulators, Horticulture', '10.1234/plantgrowth01', 15, 16, DATE '2024-03-18'),
    (8, 'Vol6Issue03', 'Effects of Deforestation on Local Flora', 'This study highlights the impact of deforestation on local plant species.', 'Research', 'Deforestation, Flora', '10.1234/deforestflora01', 17, 18, DATE '2024-04-01'),
    (9, 'Vol8Issue02', 'Photosynthesis in Extreme Environments', 'Investigating how plants adapt to extreme environmental conditions.', 'Research', 'Photosynthesis, Adaptation', '10.1234/extremephotosyn01', 19, 20, DATE '2024-02-05'),
    (10, 'Vol1Issue01', 'Conservation Strategies for Endangered Plants', 'A review of effective strategies for conserving endangered plant species.', 'Review', 'Conservation, Endangered species', '10.1234/endangeredplants01', 1, 2, DATE '2024-01-18'),
    (11, 'Vol2Issue02', 'Hydrological Impact on Plant Growth', 'How water availability influences plant development and productivity.', 'Research', 'Hydrology, Plant growth', '10.1234/hydroimpact01', 3, 4, DATE '2024-02-28'),
    (12, 'Vol9Issue01', 'Climate and Plant Phenology', 'A study on how climate change is altering plant phenology patterns.', 'Research', 'Climate change, Phenology', '10.1234/phenologyclimate01', 5, 6, DATE '2024-03-22'),
    (13, 'Vol7Issue01', 'Genetic Diversity in Native Plants', 'Research on preserving genetic diversity in native plant populations.', 'Review', 'Genetic diversity, Native plants', '10.1234/geneticnative01', 7, 8, DATE '2024-01-10'),
    (14, 'Vol3Issue01', 'Botanical Exploration of Remote Areas', 'A field study exploring the flora in remote and uncharted regions.', 'Case Study', 'Botanical exploration, Remote areas', '10.1234/botremoteregions01', 9, 10, DATE '2024-04-20'),
    (15, 'Vol5Issue02', 'Invasive Plants and Their Control', 'Research on controlling invasive plants and their environmental impact.', 'Research', 'Invasive plants, Control', '10.1234/invasiveplants01', 11, 12, DATE '2024-02-14'),
    (16, 'Vol6Issue01', 'Plant Disease Resistance Mechanisms', 'A study on how plants defend themselves against diseases.', 'Review', 'Plant defense, Disease resistance', '10.1234/plantdisease01', 13, 14, DATE '2024-03-25'),
    (17, 'Vol2Issue02', 'Impact of Urbanization on Plant Growth', 'Exploring how urban environments affect plant development and growth.', 'Research', 'Urbanization, Plant growth', '10.1234/urbanplantimpact01', 15, 11, DATE '2024-01-15'),
    (18, 'Vol3Issue03', 'Medicinal Properties of Native Plants', 'A review of the therapeutic uses of native plants.', 'Review', 'Medicinal plants, Therapeutics', '10.1234/medicinalnative01', 17, 18, DATE '2024-03-11'),
    (19, 'Vol4Issue01', 'Ecological Restoration Practices', 'A case study on effective practices for restoring degraded ecosystems.', 'Case Study', 'Ecological restoration, Practices', '10.1234/ecorestore01', 19, NULL, DATE '2024-04-15');
